# Phase 0 — Scaffold design

**Project:** `portfolio-web-app-ciruela` (Carolina M. Rivera / "Puddin's" web portfolio)
**Status:** Approved 2026-05-07
**Author:** Jose Ríos
**Implementation phase:** 0 of N (scaffold only — no design fidelity yet)

---

## 1. Overview

Build the empty, deployable shell of Carolina M. Rivera's portfolio site so subsequent phases can implement the design without paying scaffolding tax. The visual design is already locked in a Claude Design handoff bundle (`api.anthropic.com/v1/design/h/EFJ-tVZj7pontJ-6U4A2xQ`) — Phase 0 ignores design fidelity entirely and only delivers structure: project layout, content model, routing, theming foundation, build pipeline, and CI to GitHub Pages.

The handoff bundle's prototype is React + Babel-standalone. The bundle's README explicitly authorizes recreating it in any technology that fits the target codebase. Jose has chosen Astro with vanilla TypeScript islands to keep the project simpler than his usual JS/TS/React work while still meeting Jericho Digital TypeScript standards.

## 2. Scope

### In scope (Phase 0)

- Astro project initialised with `output: 'static'` and exact-pinned dependencies
- TypeScript with `strict: true`, ESLint flat config per Jericho standards
- File-based routing for the home page and all 9 category subpages (English at root, Spanish under `/es/`)
- Content collections: `projects` and `categories`, validated by zod schemas, source-of-truth = JSON files
- i18n string store (`en.json`, `es.json`) and a typed accessor helper
- Theme system: CSS custom properties, `data-theme` attribute on `<html>`, no-FOUC bootstrap script
- Lang toggle and theme toggle as minimal vanilla TS islands (functional but unstyled — design lands later)
- GitHub Actions workflow that builds and deploys to GitHub Pages on push to `main`
- One sample project JSON per kind (`design`, `artwork`) so the pipeline is exercised end-to-end
- Lint + typecheck + build all green; site deploys publicly to `https://jorius.github.io/portfolio-web-app-ciruela/` (placeholder host — see §10)

### Out of scope (Phase 0)

- Jellyfish hero, custom cursor, paint splash, marquee, scroll reveals, tilted/draggable cards, glassy showcase carousel
- Real project content beyond two stub entries
- Visual styling beyond color tokens, font loading, and a minimal layout grid
- The contact form (placeholder `mailto:` link only)
- Anything from the prototype's "Tweaks" panel — that was a Claude Design debug tool and is not shipped
- Custom domain wiring, SEO meta beyond `<title>` and `<meta description>`, sitemap, robots.txt
- Analytics, error reporting, or any third-party SDK
- Tests beyond a smoke check that `astro build` succeeds and emits the expected route count

### Explicitly deferred to later phases

| Phase | Scope |
|-------|-------|
| 1 | Home / hero with simple SVG jellyfish illustration and Carolina Rivera wordmark |
| 2 | Design portfolio section + bubble selector + glassy showcase carousel |
| 3 | Artwork portfolio section + bubble selector |
| 4 | Contact section restructured per `Ref Contact` sketch |
| 5 | Nine category subpages built from the Branding template |
| 6 | Motion stack (cursor, splash, marquee, scroll reveals, tilted cards) |
| 7 | Final SEO, accessibility audit, performance pass |

Each later phase will get its own design doc, plan, and PR cycle.

## 3. Tech inventory

| Concern | Choice | Reason |
|---|---|---|
| Framework | Astro (latest stable) | Static-first, file-based routing, content collections, built-in i18n, minimal JS by default |
| Language | TypeScript `strict: true` | Jericho non-negotiable |
| Interactivity | Vanilla TS islands via `<script>` blocks | No React/Vue/Svelte integrations — keeps it simple, ships less JS |
| Styling | Plain CSS + CSS custom properties | No Tailwind, no CSS-in-JS — Jericho standards prefer this for small projects |
| Linting | ESLint legacy config (`.eslintrc.cjs`), no Prettier | Jericho non-negotiable; legacy chosen because `airbnb-base` + `plugin:astro` flat-config support has historically been patchy |
| Git hooks | Husky `commit-msg` (Jericho verb validator) + light `pre-commit` running `lint-staged` on changed files only | Per Jose: enforce commit convention; keep pre-commit fast — no full lint sweep, no tests |
| Commit message style | Capitalized infinitive verb (`Add`, `Configure`, `Create`, `Fix`, `Update`, `Remove`, …); no conventional-commit prefixes | Jericho `GIT.md` |
| Package manager | npm with exact pinning (`save-exact=true`) | Jericho non-negotiable; lock at `package.json`, no `^`/`~` |
| Node version | LTS via `.nvmrc` | CI parity |
| Content | JSON files validated by zod | User-chosen source of truth |
| Hosting | GitHub Pages (initial) → Netlify (when partner's account exists) | User-chosen |
| CI | GitHub Actions (`actions/deploy-pages`) | First-party for GH Pages |

## 4. Directory layout

```
portfolio-web-app-ciruela/
├─ .github/workflows/deploy.yml
├─ .husky/
│  ├─ pre-commit                         # runs `npx lint-staged` (light, changed files only)
│  └─ commit-msg                         # validates Jericho verb format
├─ .nvmrc
├─ .npmrc
├─ .gitignore
├─ .eslintrc.cjs
├─ .eslintignore
├─ astro.config.mjs
├─ tsconfig.json
├─ package.json
├─ package-lock.json
├─ public/
│  ├─ icons/
│  │  ├─ behance.svg
│  │  ├─ instagram.svg
│  │  ├─ linkedin.svg
│  │  └─ whatsapp.svg
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  └─ layout/
│  │     ├─ Header.astro
│  │     ├─ Footer.astro
│  │     ├─ ThemeToggle.astro
│  │     └─ LangToggle.astro
│  ├─ content/
│  │  ├─ config.ts                      # zod schemas + defineCollection
│  │  ├─ categories/
│  │  │  ├─ design/branding.json
│  │  │  ├─ design/social-media.json
│  │  │  ├─ design/ai-designs.json
│  │  │  ├─ design/print.json
│  │  │  ├─ design/illustration.json
│  │  │  ├─ design/ui-design.json
│  │  │  ├─ artwork/drawing.json
│  │  │  ├─ artwork/painting.json
│  │  │  └─ artwork/photography.json
│  │  └─ projects/
│  │     ├─ design/branding/sample.json
│  │     └─ artwork/drawing/sample.json
│  ├─ i18n/
│  │  ├─ en.json
│  │  ├─ es.json
│  │  └─ getT.ts                        # typed string accessor
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ pages/
│  │  ├─ index.astro                    # English home (stub)
│  │  ├─ design/[category].astro
│  │  ├─ artwork/[category].astro
│  │  └─ es/
│  │     ├─ index.astro
│  │     ├─ design/[category].astro
│  │     └─ artwork/[category].astro
│  ├─ scripts/
│  │  ├─ theme.ts
│  │  └─ lang.ts
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ reset.css
│  │  └─ global.css
│  ├─ types/
│  │  └─ content.d.ts
│  └─ utils/
│     └─ localizedHref.ts
├─ docs/superpowers/specs/
│  └─ 2026-05-07-phase-0-scaffold-design.md   # this file
├─ README.md
└─ LICENSE
```

**No barrel files.** Every consumer imports from the source path directly (Jericho non-negotiable).

## 5. Content model

Two collections, both backed by JSON files and validated by zod via Astro's `defineCollection`.

### 5.1 `categories` collection

One JSON per category. Drives bubble selectors, subpage routing, and section eyebrows.

```ts
type Lang = 'en' | 'es';

interface CategoryEntry {
  slug: string;                           // e.g. 'branding'
  kind: 'design' | 'artwork';
  label: Record<Lang, string>;
  blurb: Record<Lang, string>;
  sisterCategories: string[];             // slugs of related categories
}
```

Example (`src/content/categories/design/branding.json`):

```json
{
  "slug": "branding",
  "kind": "design",
  "label": { "en": "Branding", "es": "Branding" },
  "blurb": {
    "en": "Identity systems and visual languages.",
    "es": "Sistemas de identidad y lenguajes visuales."
  },
  "sisterCategories": ["social-media", "print", "ui-design"]
}
```

### 5.2 `projects` collection

One JSON per project, organised by `kind/category/slug.json`.

```ts
interface ProjectEntry {
  slug: string;
  kind: 'design' | 'artwork';
  category: string;                       // matches a CategoryEntry slug
  title: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  studio: string;                         // 'Independent' | studio name
  role: Record<Lang, string>;
  sectors: string[];                      // free-form tags, lowercase
  year: number;
  cover: string;                          // path under /public
  gallery: GalleryItem[];                 // empty for stubs in Phase 0
}

interface GalleryItem {
  src: string;
  alt: Record<Lang, string>;
  kind: 'image' | 'video';
}
```

Phase 0 ships **two stub projects** (`design/branding/sample.json`, `artwork/drawing/sample.json`) — enough to prove `getCollection('projects')` and the dynamic routes work. Real content arrives in later phases.

## 6. Routing & i18n

- Default locale **English** at root: `/`, `/design/branding/`, `/artwork/drawing/`.
- Spanish mirrors under `/es/`: `/es/`, `/es/design/branding/`, `/es/artwork/drawing/`.
- `astro.config.mjs`:
  ```js
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  }
  ```
- Subpages use Astro's `getStaticPaths()` over the `categories` collection to generate the 9 routes per locale (18 total category pages + 2 home pages = 20 routes).
- UI strings live in `src/i18n/{en,es}.json` with identical key trees. `getT(lang)` returns a `(key: keyof Translations) => string` accessor — keys are typed from the structure of `en.json`.
- `localizedHref(lang, path)` is the single source of truth for internal links; it prefixes `/es/` when `lang === 'es'`.
- Lang toggle swaps between the same logical page across locales (e.g. on `/design/branding/` it links to `/es/design/branding/`).

## 7. Theming foundation

Single `data-theme` attribute on `<html>`. No second class, no body-level toggle. Light is default; dark is opt-in.

`src/styles/tokens.css`:

```css
:root {
  --c-accent: #7A8FF7;
  --c-ink: #34363f;
  --c-ink-soft: #5a5d6a;
  --c-bg: #f4f6fc;
  --c-bg-elev: #ffffff;
  --c-line: rgba(52, 54, 63, 0.12);

  --font-body: 'Montserrat', system-ui, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
  --font-name: 'Jost', 'Montserrat', sans-serif;
  --font-script: 'Caveat', cursive;

  --motion-fast: 180ms;
  --motion-base: 280ms;
  --motion-slow: 520ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
}

:root[data-theme='dark'] {
  --c-ink: #e6e7ee;
  --c-ink-soft: #a3a6b8;
  --c-bg: #0c0e1c;
  --c-bg-elev: #14172a;
  --c-line: rgba(230, 231, 238, 0.12);
}
```

**No-FOUC bootstrap.** Inline `<script>` in `BaseLayout.astro`'s `<head>` (~25 lines, no imports) reads `localStorage.theme` then `prefers-color-scheme` and sets `documentElement.dataset.theme` before paint. Same pattern for `lang` if user has explicitly chosen one.

Fonts load from **Google Fonts CDN** (chosen by Jose to keep complexity down) with a `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com` (the latter `crossorigin`). Each family pulls only the weights actually used to keep payload tight: Montserrat 300/400/500/600, Fraunces ital/opsz/wght (300, 400, 500), Jost 400/500/600, Caveat 400. `font-display: swap` is set so text renders in fallback before the webfont arrives. Kollektif isn't on a reliable public CDN — Jost is the documented visual stand-in (carried over from the prototype's chat decision).

## 8. Tooling configuration

### `package.json` essentials

- `"type": "module"`
- Scripts: `dev`, `build`, `preview`, `lint`, `typecheck`
- All deps pinned exact (no `^`/`~`); enforced by `.npmrc` `save-exact=true`
- `engines.node` mirrors `.nvmrc`

### `tsconfig.json`

Extends `astro/tsconfigs/strict`, plus:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### `.eslintrc.cjs`

```js
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:astro/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/no-cycle': 'error',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
      'newlines-between': 'always',
    }],
    'eqeqeq': ['error', 'always'],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

Astro single-file components get the `astro/*` parser overrides per the plugin's docs.

### `.npmrc`

```
save-exact=true
engine-strict=true
```

### `.nvmrc`

Latest Node LTS at the time of scaffolding (record exact version in the spec implementation notes when the plan is written).

### Husky hooks

Two hooks, both intentionally light:

- `commit-msg` validates the subject line matches the approved-verb regex from Jericho `GIT.md` §Commit Message Standards. The validator uses the exact verb list from that document so future updates can be ported by copying the script.
- `pre-commit` runs `npx lint-staged` and nothing else. No full lint sweep, no typecheck, no tests — those live in CI.

`lint-staged` is configured in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,astro}": "eslint --max-warnings=0",
    "*.{js,cjs,mjs}": "eslint --max-warnings=0"
  }
}
```

Setup:

- `npm install --save-dev --save-exact husky lint-staged`
- `npx husky init`
- `package.json` adds `"prepare": "husky"`

### Branching for this project

This is a personal portfolio with no DEV / SANDBOX environments and no release cadence — the full `develop` / `sandbox` / `release/*` flow from Jericho `GIT.md` is **not** adopted. The project uses a simplified two-rule flow:

- `main` is always deployable; GitHub Pages deploys from it.
- All work lands via PR from a `feature/*`, `fix/*`, or `hotfix/*` branch into `main`.
- Phase 0 itself is implemented on `feature/phase-0-scaffold` and merged via PR. Phase 0's deploy workflow runs once `main` receives the merge.

If the site ever grows enough to need a staging environment, the full Jericho branch flow can be adopted in a later phase — nothing in Phase 0 prevents that.

## 9. Build & deploy

`.github/workflows/deploy.yml`:

1. Trigger: push to `main`, plus manual `workflow_dispatch`.
2. Steps: `actions/checkout@v4` → `actions/setup-node@v4` (`node-version-file: .nvmrc`, `cache: npm`) → `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build` → `actions/upload-pages-artifact@v3` (path `./dist`) → `actions/deploy-pages@v4`.
3. Permissions: `pages: write`, `id-token: write`.
4. Concurrency group `pages` to cancel in-flight deploys.

Jose enables `Settings → Pages → Source: GitHub Actions` once in the repo UI (one-time manual step).

## 10. Migration note (placeholder host)

Jose plans to migrate this repo to Carolina's GitHub account before launch. To minimise rework:

- `astro.config.mjs` `site` and `base` are read from environment variables (`PORTFOLIO_SITE`, `PORTFOLIO_BASE`) with sensible defaults. Migration day: change two values in repository settings (or `.env`) and the build follows.
- `README.md` documents the migration checklist (transfer repo → update `site`/`base` → flip Pages source → re-run deploy → optionally point custom domain via Netlify later).
- No hard-coded absolute URLs anywhere in source — all internal links go through `localizedHref()`.

## 11. Phase 0 exit criteria

All of the following must be true before Phase 0 is considered done:

1. `npm ci && npm run lint && npm run typecheck && npm run build` succeed locally and in CI; Husky `pre-commit` and `commit-msg` hooks are installed and exercised at least once during scaffolding.
2. The deployed site at the GH Pages URL renders:
   - `/` and `/es/` (English and Spanish home stubs)
   - `/design/<category>/` and `/es/design/<category>/` for all 6 design categories
   - `/artwork/<category>/` and `/es/artwork/<category>/` for all 3 artwork categories
   - Returns of an `astro check`-style content validation pass on all 9 category JSONs and the 2 stub project JSONs.
3. Theme toggle flips `data-theme` on `<html>` and persists in `localStorage`. No FOUC on reload.
4. Lang toggle navigates between matching English/Spanish routes and persists choice for subsequent navigation within the session.
5. Lighthouse smoke pass on `/`: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 (the empty shell should easily clear these — design phases will need re-checks).
6. README updated with: project intent (Carolina's portfolio), quickstart (`npm ci`, `npm run dev`), deploy explanation, and the migration checklist from §10.

## 12. Risks & open questions

| Risk | Mitigation |
|---|---|
| GH Pages base path bakes in everywhere | Centralise via `astro.config.mjs` env-driven `site`/`base` + `localizedHref()` helper (§10) |
| ESLint flat-config support across `airbnb-base` and `plugin:astro` is patchy in some versions | Spec uses legacy `.eslintrc.cjs` (chosen in §3/§8 for stability); plan will pin known-working plugin versions |
| Google Fonts CDN is a third-party dependency on a critical render path | Use `<link rel="preconnect">` to both `fonts.googleapis.com` and `fonts.gstatic.com`; only request the weights actually used; `font-display: swap` so text never blocks; revisit self-hosting in a later phase if real-world performance demands it |
| Phase 0 ships an empty public site under Jose's account before migration | Acceptable — Jose confirmed; placeholder URL won't be promoted anywhere |

No blocking open questions at spec time.

## 13. Done definition for this spec

This document is approved when Jose signs off in the conversation thread. After approval, the implementation plan is generated by the `superpowers:writing-plans` skill.
