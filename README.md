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
