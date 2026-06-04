# Pages CMS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all portfolio projects + categories editable in the browser by a non-technical editor (Carolina) via Pages CMS, with covers/galleries as real image uploads, while keeping the existing git + Zod JSON content as the source of truth.

**Architecture:** Add a repo-root `.pages.yml` that mirrors the Astro content collections so Pages CMS (hosted, free, git-based) can render an editing UI and commit JSON back to `main`. Refactor the cover handling from a dev-only `placeholder:hue=N` token to an optional real image with a deterministic slug-derived placeholder fallback, and make all CMS-uploaded media paths base-path aware so they don't 404 under the GitHub Pages base. Migrate existing placeholder tokens out of the content.

**Tech Stack:** Astro 6 (static, content collections, Zod), Pages CMS (`.pages.yml`), Node ESM migration script. No test runner exists in this repo — verification is `astro check` (typecheck/Zod), `astro build`, ESLint, a YAML syntax check, the dev server for visual checks, and a final live connect to Pages CMS.

**Verification note (read once):** This repo has no unit-test framework, and adding one is out of scope (YAGNI). Each task is verified with the existing quality gates (`npm run typecheck`, `npm run build`, `npm run lint`) plus targeted manual/dev-server checks. `.pages.yml` cannot be fully validated locally — its real integration test is Task 10 (connect the repo in Pages CMS).

**Co-author note:** Per project convention, commits in this plan do NOT include a Claude co-author trailer (design-build phase).

---

### Task 1: Add a base-path URL helper

CMS-stored media paths look like `/images/foo.jpg`. The site deploys under base `/portfolio-web-app-ciruela`, and `import.meta.env.BASE_URL` already ends with a trailing slash (existing usage: `Hero.astro:16` does `${import.meta.env.BASE_URL}video/...`). This helper turns a stored, base-relative media path into a correct URL.

**Files:**
- Create: `src/utils/withBase.ts`

- [ ] **Step 1: Create the helper**

```ts
const BASE = import.meta.env.BASE_URL;

export const withBase = (path: string): string => {
  const trimmed = path.replace(/^\/+/, '');
  return `${BASE}${trimmed}`;
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (no errors). The file is unused so far — that's fine.

- [ ] **Step 3: Commit**

```bash
git add src/utils/withBase.ts
git commit -m "Add base-path-aware media URL helper"
```

---

### Task 2: Refactor placeholders to accept a numeric hue

`Placeholder.astro` and `CardPlaceholder.astro` currently parse a `placeholder:hue=N` string. We are removing that token, so they should take a plain `hue: number`. Callers will pass `hueFromSlug(slug)` (already exists in `src/utils/slug-hash.ts`).

**Files:**
- Modify: `src/components/visual/Placeholder.astro`
- Modify: `src/components/visual/CardPlaceholder.astro`

- [ ] **Step 1: Rewrite `Placeholder.astro` frontmatter**

Replace the frontmatter block (lines 1–17, between the `---` fences) with:

```astro
---
interface Props {
  hue: number;
  glyph?: string;
  label?: string;
}

const { hue, glyph = '◆', label } = Astro.props;
const bg = `linear-gradient(135deg, oklch(82% 0.12 ${hue}) 0%, oklch(62% 0.15 ${(hue + 30) % 360}) 100%)`;
---
```

Leave the markup below the frontmatter unchanged.

- [ ] **Step 2: Rewrite `CardPlaceholder.astro` frontmatter**

Replace the frontmatter block (lines 1–15) with:

```astro
---
interface Props {
  hue: number;
  glyph?: string;
}

const { hue, glyph = '◆' } = Astro.props;
const bg = `linear-gradient(135deg, oklch(78% 0.14 ${hue}) 0%, oklch(58% 0.17 ${(hue + 25) % 360}) 100%)`;
---
```

Leave the markup and `<style>` block below unchanged.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: errors in `Gallery.astro`, `Showcase.astro`, `SubpageGrid.astro` (they still pass `cover=` to these components). That is expected — Tasks 3 and 4 fix the callers. Confirm the only errors are about the `cover` prop on these placeholder components.

- [ ] **Step 4: Do NOT commit yet**

Commit happens after callers are fixed (Task 4) so the build stays green at each commit.

---

### Task 3: Make `cover` optional in the content schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Make cover optional**

In the `projects` collection schema, change:

```ts
    cover: z.string(),
```

to:

```ts
    cover: z.string().optional(),
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: same caller errors as Task 2 Step 3 (cover prop). No NEW schema errors. Existing content still has `cover` strings, which remain valid against an optional string.

- [ ] **Step 3: Do NOT commit yet** (continues in Task 4).

---

### Task 4: Render real covers + gallery images with base-path

Update the three callers to render an `<img>` (base-path aware) when a cover/gallery image exists, else the placeholder using `hueFromSlug`.

**Files:**
- Modify: `src/components/sections/Showcase.astro`
- Modify: `src/components/sections/SubpageGrid.astro`
- Modify: `src/components/visual/Gallery.astro`

- [ ] **Step 1: `Showcase.astro` — add import**

After line 7 (`import Placeholder ...`), add:

```astro
import { withBase } from '../../utils/withBase';
```

- [ ] **Step 2: `Showcase.astro` — replace the cover logic + screen markup**

Replace lines 25–39 (the `items.map((item) => { ... }` opening through the `<div class="showcase-screen">...</div>` line) so the mapped block reads:

```astro
    {items.map((item) => {
      const hue = hueFromSlug(item.data.slug);
      const cover = item.data.cover;
      return (
        <a
          class="showcase-card"
          data-slug={item.data.slug}
          data-category={category}
          href={localizedHref(lang, `/${kind}/${category}/${item.data.slug}/`)}
          data-cursor="media"
          data-cursor-label={categoryLabel}
        >
          <div class="showcase-frame">
            <div class="showcase-tag">{categoryLabel}</div>
            <div class="showcase-screen">
              {cover
                ? <img src={withBase(cover)} alt={item.data.title[lang]} loading="lazy" decoding="async" />
                : <Placeholder hue={hue} glyph="◆" />
              }
            </div>
```

(The `<div class="showcase-meta">` block and everything after stay exactly as they are.)

- [ ] **Step 3: `SubpageGrid.astro` — add import**

After line 6 (`import CardPlaceholder ...`), add:

```astro
import { withBase } from '../../utils/withBase';
```

- [ ] **Step 4: `SubpageGrid.astro` — replace the card map**

Replace lines 47–58 (the `projects.map((p) => { ... })` block) with:

```astro
    {projects.map((p) => {
      const hue = hueFromSlug(p.data.slug);
      const cover = p.data.cover;
      return (
        <a class="sub-card"
           href={localizedHref(lang, `/${category.data.kind}/${category.data.slug}/${p.data.slug}/`)}
           data-cursor="media" data-cursor-label={category.data.label[lang]}>
          {cover
            ? <img class="sub-card-img" src={withBase(cover)} alt={p.data.title[lang]} loading="lazy" decoding="async" />
            : <CardPlaceholder hue={hue} glyph="◆" />
          }
          <span class="sub-tag">{p.data.title[lang]}</span>
        </a>
      );
    })}
```

- [ ] **Step 5: `SubpageGrid.astro` — add a scoped style for the real image**

So an uploaded cover matches the placeholder's 4/5 framing. Append this `<style>` block at the very end of the file (after `</section>`):

```astro
<style>
  .sub-card-img {
    aspect-ratio: 4 / 5;
    width: 100%;
    border-radius: var(--radius-sm);
    object-fit: cover;
    display: block;
  }
</style>
```

- [ ] **Step 6: `Gallery.astro` — add import**

After line 6 (`import Placeholder ...`), add:

```astro
import { withBase } from '../../utils/withBase';
```

- [ ] **Step 7: `Gallery.astro` — base-path the gallery image + fix placeholder prop**

Replace lines 49–52 (the `{s.kind === 'image' ? ... : ...}` ternary) with:

```astro
            {s.kind === 'image'
              ? <img src={withBase(s.src)} alt={s.alt} loading="lazy" decoding="async" />
              : <Placeholder hue={s.hue} glyph="◆" />
            }
```

- [ ] **Step 8: Typecheck + lint + build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: ALL PASS. 168 pages build. No `cover`/`hue` prop errors remain.

- [ ] **Step 9: Visual check in dev**

Run: `npm run dev`
Open the homepage and one subpage (e.g. `/design/branding/`). Expected: cards/showcase still show gradient placeholders (no real covers yet), layout unchanged. Stop the dev server.

- [ ] **Step 10: Commit**

```bash
git add src/content.config.ts src/components/visual/Placeholder.astro src/components/visual/CardPlaceholder.astro src/components/sections/Showcase.astro src/components/sections/SubpageGrid.astro src/components/visual/Gallery.astro
git commit -m "Support optional real cover/gallery images with base-path fallback"
```

---

### Task 5: Migrate existing placeholder cover tokens out of content

All current project JSONs carry `"cover": "placeholder:hue=N"`. With cover now optional + slug-derived fallback, remove those tokens. Placeholder colors will shift from hand-picked hues to `hueFromSlug` — acceptable (temporary placeholders).

**Files:**
- Create: `scripts/migrate-covers.mjs`
- Modify: every `src/content/projects/**/*.json` carrying a `placeholder:` cover (done by the script)

- [ ] **Step 1: Write the migration script**

```js
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'src/content/projects';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (extname(entry.name) === '.json') yield p;
  }
}

let changed = 0;
for await (const file of walk(ROOT)) {
  const json = JSON.parse(await readFile(file, 'utf8'));
  if (typeof json.cover === 'string' && json.cover.startsWith('placeholder:')) {
    delete json.cover;
    await writeFile(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
    changed += 1;
    console.log(`migrated: ${file}`);
  }
}
console.log(`Done. ${changed} files migrated.`);
```

- [ ] **Step 2: Run the migration**

Run: `node scripts/migrate-covers.mjs`
Expected: ~70 `migrated:` lines, then `Done. N files migrated.`

- [ ] **Step 3: Spot-check a migrated file**

Run: `git diff src/content/projects/design/branding/01-aurora-studio.json`
Expected: only the `"cover": "placeholder:hue=262",` line removed; all other fields intact; 2-space indent preserved; trailing newline.

- [ ] **Step 4: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS, 168 pages. Optional cover means missing cover is valid.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-covers.mjs src/content/projects
git commit -m "Migrate placeholder cover tokens to optional empty covers"
```

---

### Task 6: Establish the media upload folder

Pages CMS writes uploads to `public/images` (the `media.input`). Git won't track an empty dir.

**Files:**
- Create: `public/images/.gitkeep`

- [ ] **Step 1: Create the folder marker**

Run: `mkdir -p public/images && touch public/images/.gitkeep`

- [ ] **Step 2: Commit**

```bash
git add public/images/.gitkeep
git commit -m "Add public/images media folder for CMS uploads"
```

---

### Task 7: Author `.pages.yml`

The CMS config. Mirrors `src/content.config.ts`. Uses a reusable `langString` component (referenced via `component:`, confirmed syntax), `subfolders: true` + tree view for the nested project/category folders, and `format: json`.

**Files:**
- Create: `.pages.yml` (repo root)

- [ ] **Step 1: Write `.pages.yml`**

```yaml
media:
  input: public/images
  output: /images
  categories: [image, video]
  extensions: [jpg, jpeg, png, webp, avif, mp4]

components:
  langString:
    type: object
    label: Bilingual text
    fields:
      - { name: en, label: English, type: string }
      - { name: es, label: Español, type: string }

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
      fields: [title.en, kind, category, year]
    fields:
      - { name: slug, label: Slug, type: string, required: true }
      - { name: kind, label: Kind, type: select, required: true, options: { values: [design, artwork] } }
      - { name: category, label: Category slug, type: string, required: true }
      - { name: title, label: Title, component: langString, required: true }
      - { name: subtitle, label: Subtitle, component: langString, required: true }
      - { name: overview, label: Overview, component: langString }
      - { name: studio, label: Studio, type: string, required: true }
      - { name: role, label: Role, component: langString, required: true }
      - { name: sectors, label: Sectors, type: string, list: true }
      - { name: year, label: Year, type: number, required: true }
      - { name: cover, label: Cover image, type: image }
      - name: gallery
        label: Gallery
        type: object
        list: true
        fields:
          - { name: src, label: File, type: file, required: true }
          - { name: alt, label: Alt text, component: langString, required: true }
          - { name: kind, label: Type, type: select, required: true, options: { values: [image, video] } }

  - name: categories
    label: Categories
    type: collection
    path: src/content/categories
    subfolders: true
    format: json
    view:
      layout: tree
      primary: label.en
      fields: [label.en, kind]
    fields:
      - { name: slug, label: Slug, type: string, required: true }
      - { name: kind, label: Kind, type: select, required: true, options: { values: [design, artwork] } }
      - { name: label, label: Label, component: langString, required: true }
      - { name: blurb, label: Blurb, component: langString, required: true }
      - { name: sisterCategories, label: Sister categories (slugs), type: string, list: true }
```

- [ ] **Step 2: YAML syntax check**

Run: `npx --yes js-yaml .pages.yml > /dev/null && echo "YAML OK"`
Expected: `YAML OK` (parses without error). This validates syntax only — semantic validation happens in Task 10.

- [ ] **Step 3: Commit**

```bash
git add .pages.yml
git commit -m "Add Pages CMS configuration"
```

---

### Task 8: Write the editor onboarding + migration guide

A short doc covering: what's now CMS-managed, the one-time setup (GitHub account, collaborator invite, connect repo / install GitHub App), how editing/saving works (commits to `main`, auto-deploy), and image guidance (web-optimize before upload; metadata is NOT auto-stripped).

**Files:**
- Create: `docs/cms-guide.md`

- [ ] **Step 1: Write the guide**

```markdown
# Editing the portfolio with Pages CMS

This site's content (projects + categories) is edited through **Pages CMS**, a
free browser-based editor. Saving in the CMS commits to the repository and the
live site rebuilds automatically.

## One-time setup (for the editor)

1. Create a free GitHub account (if you don't have one).
2. Ask the repo owner to invite you as a **collaborator** on
   `portfolio-web-app-ciruela` and accept the email invite.
3. Go to https://app.pagescms.org and sign in with GitHub.
4. Authorize the **Pages CMS GitHub App** for the repository when prompted.
5. Open the repository in Pages CMS — you'll see **Projects** and **Categories**.

## Editing content

- **Projects** and **Categories** are browsable as folder trees (by kind, then
  category). Click an entry to edit it.
- Every text field has **English** and **Español** boxes — fill both.
- **Cover image:** optional. If you leave it empty, the site shows a colored
  placeholder. Upload an image to replace it.
- **Gallery:** add items; each is a file (image or `.mp4`), an alt text
  (EN/ES), and a type (image/video).
- Click **Save** — this commits your change. The live site updates within a few
  minutes once the build finishes.

## What is NOT in the CMS

- Site-wide copy (hero tagline, contact text, nav labels) is managed in code.
  Ask the repo owner to change these.
- Hero background videos are managed manually (optimized + tracked separately).

## Image guidance (important)

- **Optimize before uploading**: export web-sized images (long edge ~2000px,
  JPG/WebP). The CMS does not compress for you.
- **Metadata is not stripped automatically.** Photo files can carry EXIF/IPTC
  data (camera, location). If that matters, strip metadata before uploading.

## How content moved into the CMS

The existing projects/categories were already stored as JSON in the repo, so
they appear in the CMS automatically — no manual re-entry. The only change was
removing developer placeholder tokens from cover fields; covers now start empty
and show a generated placeholder until you upload a real image.
```

- [ ] **Step 2: Commit**

```bash
git add docs/cms-guide.md
git commit -m "Add Pages CMS editor onboarding and migration guide"
```

---

### Task 9: Push the branch and open a PR

**Files:** none (git operations).

- [ ] **Step 1: Push**

Run: `git push -u origin feature/pages-cms-integration`
Expected: branch created on origin.

- [ ] **Step 2: Open PR**

```bash
gh pr create --base main --head feature/pages-cms-integration \
  --title "Add Pages CMS for browser-based content management" \
  --body "Adds .pages.yml so projects + categories are editable in Pages CMS. Refactors covers to optional real images with slug-derived placeholder fallback, base-path-aware media rendering, migrates placeholder cover tokens, and adds an editor guide. See docs/superpowers/specs/2026-05-28-pages-cms-content-management-design.md."
```

Expected: PR URL returned. Do NOT merge yet — Task 10 must validate the live CMS connection first, and Jose reviews.

---

### Task 10: Connect the repo in Pages CMS and validate live (manual)

This is the real integration test for `.pages.yml`. Requires Jose (repo owner) and is done after the PR branch is pushed (Pages CMS can target the branch, or validate after merge on `main`).

- [ ] **Step 1: Install the GitHub App**

Sign in at https://app.pagescms.org with GitHub and authorize the Pages CMS GitHub App on `portfolio-web-app-ciruela`.

- [ ] **Step 2: Open the repo and confirm config loads**

Expected: Pages CMS reads `.pages.yml` with no config error; **Projects** and **Categories** collections appear.

- [ ] **Step 3: Verify a project opens correctly**

Open one project (e.g. `design/branding/01-aurora-studio`). Expected: EN/ES boxes for title/subtitle/overview/role; studio, sectors, year, cover (empty), gallery editors all render and match the JSON.

- [ ] **Step 4: Do a throwaway edit + save**

Change a subtitle's ES text, Save, confirm a commit lands on the target branch and the JSON updated correctly. Revert it (edit back + save) to keep content clean.

- [ ] **Step 5: Invite Carolina**

Invite her GitHub account as a collaborator; have her complete the setup in `docs/cms-guide.md` and confirm she can open and edit a project.

- [ ] **Step 6: Merge the PR** (after Jose's review + a clean live test)

Merge via merge commit (no rebase). The deploy Action rebuilds `main`.

---

## Notes for the implementer

- **Do not** add a test framework — none exists; use the gates above.
- **Do not** touch the uncommitted hero-video experiment (`src/scripts/hero-video.ts`, `public/video/d2.mp4`) in the working tree — leave it untracked/unstaged. Stage only the files each task names.
- Keep commits scoped per task (the `git add <specific paths>` lines matter — never `git add -A`).
- Build must be green (`typecheck`, `lint`, `build`) at every commit from Task 4 onward.
