# Carolina M. Rivera — Portfolio

Personal portfolio for **Carolina M. Rivera**, Graphic Designer & Visual Artist. Built from a Claude Design handoff bundle as an Astro static site with vanilla TypeScript islands.

## Quickstart

```bash
npm ci          # exact-pinned install
npm run dev     # dev server on http://localhost:4321
npm run build   # static build to dist/
npm run preview # preview the production build locally
```

Other scripts:
- `npm run lint` — ESLint with airbnb-base + TypeScript-strict rules
- `npm run typecheck` — `astro check`, validates content collections too

## Project structure

See `docs/superpowers/specs/2026-05-07-phase-0-scaffold-design.md` §4 for the canonical tree. Headlines:

- `src/pages/` — file-based routing, English at root, Spanish under `/es/`
- `src/content/` — JSON-backed content collections (`categories`, `projects`) validated by zod
- `src/i18n/` — `en.json` + `es.json` + typed `getT(lang)` accessor
- `src/styles/` — design tokens, modern reset, global stylesheet
- `src/components/layout/` — Header, Footer, ThemeToggle, LangToggle (the only Phase 0 components)
- `src/scripts/` — vanilla TypeScript islands hydrated by Astro

## Stack

| | |
|---|---|
| Framework | Astro (static output) |
| Language | TypeScript strict |
| Styling | Plain CSS with custom properties; no Tailwind, no CSS-in-JS |
| Content | JSON files validated by zod via Astro content collections |
| i18n | Astro built-in routing, prefix-default-locale=false |
| Hosting | GitHub Pages (initial) → Netlify with custom domain (planned) |
| CI | GitHub Actions, `actions/deploy-pages@v4` |
| Hooks | Husky + lint-staged + Jericho `commit-msg` verb validator |

## Phase 1 — Mega-design

The full visual + motion design landed in `feature/phase-1-design`. Highlights:

- **Hero:** three SVG jellyfish (build-time tendril paths via mulberry32) drift independently, with a scroll-fade parallax. Carolina Rivera wordmark in Jost 500 + Fraunces italic 300, stagger-revealed.
- **Design and Artwork sections:** category bubble selector + glassy carousel + meta strip. Two-event loop (`bubble:change`, `carousel:active`) keeps the meta strip in sync with the active card.
- **Subpages:** 9 category pages (6 design × 3 artwork) render the Branding template — 8 tilted draggable cards per category with sister-category bubbles.
- **Contact:** restructured per the design-handoff `Ref Contact` sketch, mailto-only form, four social bubbles in canonical order.
- **Motion stack:** custom morphing cursor, paint splash on click, marquee tickers, scroll reveals, jellyfish drift, sparkles, tilted-grid drag. All disable on `prefers-reduced-motion`; cursor also disables on `pointer: coarse`.
- **Content:** 72 placeholder project entries (8 per category × 9 categories) generated via `scripts/seed-placeholders.mjs`. Real photos slot in via the `cover` field once Carolina provides them.
- **i18n:** EN and ES parity for every UI string; placeholder ES on project content.

### Manual smoke checklist (run after each Phase 1 PR rebase)

Open the dev server (`npm run dev`) and verify:

1. **Hero:** Jellyfish drift visible. Scroll down past the hero and watch jellyfish fade out. Click anywhere — 8 colored drops fly out and fade.
2. **Marquee:** Hover the marquee — animation pauses. Move pointer away — resumes.
3. **Reveals:** Scroll back up. Each section title and the wordmark animate in via the staggered reveal.
4. **Design section:** Click each of the six bubbles — eyebrow updates ("—DESIGN PORTFOLIO. SELECTED. · <category>"), carousel content swaps, meta strip seeds from the first project of that category.
5. **Carousel:** Scroll the carousel. Active card scales up; meta strip updates as you scroll.
6. **Artwork section:** Repeat (4) and (5) with the three artwork categories.
7. **Contact:** Click Copy email — button text changes to "Copied" for ~1.6 s. Click Send — mail client opens with the form fields pre-filled.
8. **Subpage:** Navigate to `/design/branding/`. 8 tilted cards render. Drag horizontally — grid pans. Sister-category bubbles link to other design subpages.
9. **Custom cursor (desktop):** Cursor follows the pointer with a soft lerp. Hover any link — ring grows to 56px solid border. Hover a carousel card — ring grows to 96px filled disk.
10. **Reduced-motion smoke:** Open OS Settings → Reduce Motion → enable. Reload `/`. Verify: jellyfish still, marquee frozen, reveals visible immediately, no splash on click, system cursor visible (no custom dot/ring), tilted grid flat.
11. **Touch device smoke:** Open the deployed URL on a phone. Verify: no custom cursor (system cursor only); every other motion item still runs.
12. **Both locales:** Navigate to `/es/`. Confirm Spanish strings render (Inicio, Diseño, Obra, Contacto). LangToggle swaps EN ↔ ES on the same path.

## Contributing

This repo follows **Jericho Digital** TypeScript and Git standards.

Commit messages start with a capitalized infinitive verb (`Add`, `Fix`, `Update`, `Configure`, `Document`, …) — the `commit-msg` hook rejects anything else. See [Jericho `GIT.md`](https://example.invalid/jericho-git-md) for the full verb list.

Branching: `feature/*`, `fix/*`, `hotfix/*` → PR → `main`. There is no `develop` or `sandbox` for this project.

## Migration checklist (when transferring to Carolina's GitHub account)

1. Transfer the repo via GitHub repo settings.
2. Update the `PORTFOLIO_SITE` and `PORTFOLIO_BASE` env vars in `.github/workflows/deploy.yml` (and any local `.env` you keep) to the new account/domain.
3. In the new repo: `Settings → Pages → Source: GitHub Actions`.
4. Push any commit to `main`; the deploy workflow runs end-to-end.
5. (Optional) When a custom domain lands on Netlify, set `PORTFOLIO_BASE=` (empty) and `PORTFOLIO_SITE` to the canonical domain.

## License

See `LICENSE`.
