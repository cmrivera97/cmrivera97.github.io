# Pages CMS — Content Management Design

**Date:** 2026-05-28
**Branch:** `feature/pages-cms-integration`
**Status:** Design — awaiting review

## Goal

Give Carolina a free, plug-and-play, browser-based way to manage all portfolio
content (projects, categories, bilingual copy, cover/gallery images) without
touching code, a terminal, or self-hosted infrastructure. The existing git +
Zod content model stays the source of truth.

## Constraints (locked with Jose)

- **Free** and **zero self-hosted infrastructure** — no Strapi, no Keystatic
  admin to host, no OAuth proxy to run.
- **Browser editing by a non-technical editor** (Carolina).
- Keep the current Astro static build, GitHub Pages deploy, and the
  `src/content/**` JSON + Zod schema as the canonical content store.

## Decision: Pages CMS (pagescms.org)

A hosted, open-source, git-based CMS. The editor signs in at `app.pagescms.org`
with GitHub, authorizes the repo via the Pages CMS GitHub App, and edits content
through a generated UI. Saves commit JSON straight back to the repo. Config lives
in a single `.pages.yml` at the repo root that mirrors the Zod schema.

**Why it fits over the alternatives considered:**
- **Keystatic** — best fidelity, but its admin needs an SSR host (Cloudflare/
  Netlify). Rejected: not plug-and-play.
- **Decap CMS** — its i18n model wants per-locale files or top-level locale keys,
  fighting our nested `{en,es}` field shape. Rejected: schema friction + aging.
- **Sanity / headless DB** — abandons git-as-source-of-truth. Rejected.

Pages CMS confirmed capabilities (verified against current docs, 2026-05):
- `format: json` collections.
- `object` fields nest arbitrarily → models `langString = { en, es }` exactly.
- `subfolders: true` + tree view → browses our two-level
  `projects/<kind>/<category>/*.json` layout in one collection.
- `media` config maps an `input` (repo folder) to an `output` (public URL path)
  for image/video uploads.

## Required editor onboarding (unavoidable)

Any git-based browser CMS authenticates the editor via GitHub. Therefore:
- Carolina needs a **free GitHub account**.
- She is added as a **collaborator** on `jorius/portfolio-web-app-ciruela`.
- She installs/authorizes the **Pages CMS GitHub App** on the repo (one-time).

There is no git-based CMS where the editor logs in without a GitHub identity. If
this is unacceptable, the only path is a hosted headless DB CMS, which is out of
scope per the constraints above.

## Architecture & data flow

```
Carolina (browser) → app.pagescms.org → Pages CMS GitHub App
        → commit JSON / uploaded media to `main`
        → push to main triggers .github/workflows/deploy.yml
        → lint + typecheck + `astro build` (Zod validates content)
        → deploy to GitHub Pages
```

- **Commit target:** `main` (direct). Simplest; the existing deploy Action
  rebuilds on every push to `main`. The build's Zod validation is the safety gate
  — malformed content fails the build, the live site is unaffected until fixed.
  (Alternative considered: a `content` draft branch + PR. Rejected for now as
  extra friction for a single non-technical editor; revisit if needed.)
- No new runtime dependency is added to the site itself. Pages CMS is entirely
  external; the only repo artifact is `.pages.yml` (+ small code changes below).

## `.pages.yml` configuration

### Media

```yaml
media:
  input: public/images        # uploads committed here
  output: /images             # path written into content (see base-path note)
  extensions: [jpg, jpeg, png, webp, avif, mp4]
  categories: [image, video]
```

### Collections

Two collections — `projects` and `categories` — both `format: json`.

**Projects** (single collection, nested folders via `subfolders: true`):

```yaml
content:
  - name: projects
    label: Projects
    type: collection
    path: src/content/projects
    subfolders: true
    format: json
    view:
      layout: tree
      primary: title.en
    fields: [ ...see schema mapping... ]

  - name: categories
    label: Categories
    type: collection
    path: src/content/categories
    subfolders: true
    format: json
    view:
      layout: tree
      primary: label.en
    fields: [ ...see schema mapping... ]
```

### Schema mapping (Zod → Pages CMS fields)

Bilingual `langString` becomes a reusable `component`:

```yaml
components:
  langString:
    type: object
    fields:
      - { name: en, label: English, type: string }
      - { name: es, label: Español, type: string }
```

| Zod field (`content.config.ts`) | Pages CMS field |
| --- | --- |
| `slug: string` | `string` |
| `kind: enum(design|artwork)` | `select` (options design/artwork) |
| `category: string` | `select` (category slugs) |
| `title/subtitle/role: langString` | `object` via `langString` component |
| `overview: langString?` | `object` (langString), not required |
| `studio: string` | `string` |
| `sectors: string[]` | `string` list (`list: true`) |
| `year: number().int()` | `number` |
| `cover: string` | `image` field (see Cover refactor) |
| `gallery: galleryItem[]` | `object` list: `{ src: file, alt: langString, kind: select }` |
| categories `label/blurb: langString` | `object` via `langString` |
| categories `sisterCategories: string[]` | `string` list |

`galleryItem.src` uses a **file** field (so it accepts both images and `.mp4`),
paired with `kind: select(image|video)` and `alt` (langString object).

## Required code changes

These are small, targeted changes to make CMS output render correctly. They are
in scope because the current content model has two dev-only artifacts that don't
survive a non-technical editor.

### 1. Cover field UX (`placeholder:hue=N` → real image + fallback)

Today `cover` is a string holding a dev token like `"placeholder:hue=262"`.
A non-technical editor can't author that. Change:
- `.pages.yml` exposes `cover` as an optional **image** field.
- Schema/consumer change: `cover` becomes optional; when **empty**, components
  render the existing `Placeholder` with a **deterministic hue derived from the
  slug** (reuse `slug-hash.ts` / `mulberry32.ts`) instead of a hand-typed hue.
- `Placeholder.astro` keeps working; the caller decides image-vs-placeholder by
  checking whether `cover` is set, rather than parsing the `placeholder:` prefix.
- Existing `"placeholder:hue=N"` values are migrated to empty covers. The
  slug-derived fallback assigns a new deterministic hue per project, so some
  placeholder colors will shift from their current hand-picked values — acceptable,
  since these are temporary placeholders pending Carolina's real images.

### 2. Base-path-aware image rendering

`Gallery.astro` (and cover rendering) currently emit `item.src` verbatim. The
site deploys under base `/portfolio-web-app-ciruela`, so a stored `/images/x.jpg`
would 404 on the live site. Fix: prefix stored media paths with
`import.meta.env.BASE_URL` at render time (store base-relative `/images/...` in
content; prepend `BASE_URL` in the component). This keeps content host-agnostic
and `.pages.yml`'s `output: /images` correct.

### 3. `.gitattributes` / media size

Real photos go in `public/images/` as normal git blobs (not LFS — LFS is reserved
for the hero `*.mp4`). Editors should upload web-optimized images; document a size
guideline in the onboarding note. (No automatic transcoding in the CMS path; that
remains a manual/asset-hygiene step for hero video only.)

## Validation & safety

- Pages CMS validates required fields / types against `.pages.yml` client-side.
- The deploy Action re-validates via `astro build` (Zod). A bad commit fails the
  build and never deploys — the live site is never broken by a malformed save.
- Asset metadata hygiene (EXIF/IPTC/XMP strip) still applies to real photos; note
  that Pages CMS uploads do **not** strip metadata, so this stays a pre-upload
  responsibility (documented in onboarding).

## Out of scope (YAGNI)

- Draft/preview environments, editorial workflow, or content scheduling.
- Migrating hero video management into the CMS (stays manual + LFS).
- Automated image optimization/metadata stripping in the CMS pipeline.
- Self-hosting Pages CMS (possible later; not now).
- Localizing the Pages CMS UI itself (editor works in the default UI).

## Deliverables

1. `.pages.yml` at repo root (collections, components, media, settings).
2. Cover refactor (schema optional + slug-derived placeholder fallback) and
   migration of existing `placeholder:hue=N` values to empty.
3. Base-path-aware image rendering in `Gallery.astro` + cover consumers.
4. `public/images/` convention established.
5. Short onboarding doc: GitHub account + collaborator invite + connect repo +
   image size/metadata guidance.
