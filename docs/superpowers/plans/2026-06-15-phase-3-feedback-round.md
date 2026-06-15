# Phase 3 Feedback Round (Carolina, dark-mode review) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the feedback items from the second `feedback.pdf` ("Observaciones Website CaroPortfolio — DARK MODE", 4 pages, 11 items) to the Astro portfolio — hero video/scroll, carousel selectability, preview spacing, detail-image fit, two text edits, and dark-mode button colour parity. Plus an out-of-band request: **remove the `ui-design` design category** (Carolina deleted it in pagescms.org and it can't be recreated — Task 7).

**Architecture:** Astro 6 static site, plain CSS with design tokens (`src/styles/`), TypeScript hydration scripts (`src/scripts/`), bilingual content in `src/content/**` + `src/i18n/{en,es}.json`. Most changes are CSS, content/i18n, and small script edits. No unit-test framework exists; this is a visual frontend project, so **verification = `npm run typecheck && npm run lint && npm run build` all clean, plus a manual visual check in `npm run dev`** for the visually-driven items (2, 3, 4, 11). All work lands on branch `feature/phase-3-feedback-round`, one commit per task, **committed locally only — the user handles all pushes / the PR.**

**Tech Stack:** Astro 6.3.1, TypeScript, plain CSS (`@import` tokens/reset), ESLint (airbnb-base, `--max-warnings=0`), `astro check`.

> **Commit convention (Jericho + project memory):** the `.husky` `commit-msg` hook enforces messages starting with a **capitalized infinitive verb** (`Add`, `Fix`, `Update`, `Remove`, `Restyle`, `Refine`…) — **no** `feat:`/`fix:` prefixes and **no** `Co-Authored-By` trailer. TypeScript edits keep explicit return types, single quotes, semicolons, and labeled import groups.

---

## Source feedback (verbatim, de-garbled from the PDF text layer)

Under the heading **"Observaciones Website CaroPortfolio — DARK MODE":**

1. No hay animación en el home. El video no reproduce.
2. Hay un salto raro en el scroll, no se ve fluido. Hacer el desplazamiento de la vista principal al primer apartado del home rápido pero con un movimiento continuo, no cortado.
3. Conserva un poco de margen en las previsualizaciones.
4. No cortar las imágenes en la vista final. Encajar contenido.
5. Permite darle click al contenido que no está en la vista frontal para seleccionar.
6. Mostrar contenido en la vista general de categorías.
7. Modifica el texto por "Creando identidades entre páginas, pantallas y lienzos…"
8. Elimina este texto.
9. Cambia el texto por: "Acuarela, óleo y acrílico. Piezas finales y estudios)".
10. Quita la palabra "tranquila" para el apartado de fotografía.
11. Aplica el cambio de color a los botones como en el modo light.

---

## Item triage

| # | Item | Status | Where |
|---|------|--------|-------|
| 1 | Hero video doesn't play | **BLOCKED — missing assets** | `public/video/*.mp4` are 133-byte stubs |
| 2 | Scroll hero→first section feels cut, not fluid | Code (tuning) | `src/scripts/hero-snap.ts` |
| 3 | Keep some margin in the previews | Code (verify/tweak) | `src/styles/global.css` showcase |
| 4 | Don't crop images in final view; fit content | Code | `src/styles/global.css` `.gallery … img` |
| 5 | Allow clicking non-front carousel cards to select | Code | `src/scripts/carousel.ts` |
| 6 | Show content in the general category view | **NEEDS CLARIFICATION** | live UI |
| 7 | Change hero tagline text | Code | `src/i18n/{en,es}.json` `hero.lede` |
| 8 | Delete *this* text | **NEEDS CLARIFICATION** (which element?) | screenshot-annotated |
| 9 | Change painting blurb text | Code | `src/content/categories/artwork/painting.json` |
| 10 | Remove "tranquila" in photography | **Likely already done** | not present in current content |
| 11 | Dark-mode button colour change like light | Code | `src/styles/global.css` dark hover rules |

### Blocked / clarification items — detail

- **Item 1 (video):** `public/video/d2.mp4`, `hero-h-dark.mp4`, `hero-v-dark.mp4` are all ~132–133 bytes — placeholder stubs, not real MP4s. The markup (`autoplay muted loop playsinline`, `src/components/sections/Hero.astro:10-17`) and `src/scripts/hero-video.ts` are correct; nothing plays because there is no real footage. **Resolution: Carolina must supply the real MP4 files** (same names, in `public/video/`). No code change fixes this. Posters render as a static fallback meanwhile.
- **Item 6:** "Show content in the general category view" is ambiguous. The category subpage (`SubpageGrid.astro`) already renders project cards with covers or abstract placeholders; the home portfolio sections show one category's showcase at a time. Need Carolina to point at the exact view + what's missing before changing layout.
- **Item 8:** "Delete this text" references a specific element circled in the PDF screenshot. The PDF image layer can't be rendered in this environment (text layer only), so the target element is unknown. **Resolution: ask which text** (candidates near the page-3 edits: hero `since` line, hero `eyebrow`, `scrollHint`, or a portfolio eyebrow).
- **Item 10:** grep across the repo finds **no "tranquila"** in `src/content/**` — only in `scripts/seed-placeholders.mjs` (the un-run seeder) and `docs/`. The live photography content (e.g. `02-cocina.json`) no longer uses it. Treat as already satisfied pending Carolina's confirmation against the deployed build she reviewed.

---

## Task 1: Text edits — hero tagline + painting blurb (items 7, 9)

**Files:** `src/i18n/en.json`, `src/i18n/es.json`, `src/content/categories/artwork/painting.json`

- [ ] **Item 7 — `hero.lede`.** ES becomes the exact requested copy; EN gets a faithful parallel so the bilingual site stays in sync.
  - `es.json` `hero.lede`: → `"Creando identidades entre páginas, pantallas y lienzos…"`
  - `en.json` `hero.lede`: → `"Creating identities across pages, screens, and canvases…"`
- [ ] **Item 9 — painting blurb.** The requested ES text has a stray `)` and uses a period; normalize to clean copy.
  - `painting.json` `blurb.es`: → `"Acuarela, óleo y acrílico. Piezas finales y estudios."`
  - `painting.json` `blurb.en`: → `"Watercolor, oil, and acrylic. Finished works and studies."`
- [ ] **Verify:** `npm run typecheck && npm run lint && npm run build`. Check `/` and `/es/` hero lede, and the painting category blurb (home artwork bubble + `/artwork/painting/`).
- [ ] **Commit:** `Update hero tagline and painting blurb copy`

## Task 2: Carousel — select non-front cards (item 5)

**Files:** `src/scripts/carousel.ts`

The home showcase loop carousel disables pointer events on every non-centred card (`layoutLoop`, line ~105: `card.style.pointerEvents = abs === 0 ? 'auto' : 'none'`). Feedback: a visible neighbour you can see should be clickable to bring it to front.

- [ ] **Step 1:** In `layoutLoop`, allow the immediate neighbours (`abs <= 1`) to receive pointer events so they're clickable; keep deeper/hidden cards inert.
  - `card.style.pointerEvents = abs <= 1 ? 'auto' : 'none';`
- [ ] **Step 2:** In `initLoopTrack`, add a capture-phase click handler on the track: if the clicked card is **not** the active one, `preventDefault()` the navigation and `goTo` that card's index instead (first click selects/centres, the now-centred card navigates on a second click as before).
- [ ] **Verify:** `npm run typecheck && npm run lint && npm run build`, then `npm run dev`: on the home showcase, clicking a side card slides it to centre instead of navigating; clicking the centre card still opens the project.
- [ ] **Commit:** `Allow selecting non-centered carousel cards by click`

## Task 3: Detail gallery — fit images, no crop (item 4)

**Files:** `src/styles/global.css` (`.gallery .showcase-screen img`, line ~1073)

"Vista final" = the project-detail gallery. It currently uses `object-fit: cover` (crops). Switch to `contain` so the whole image fits, with a neutral backdrop behind any letterboxing.

- [ ] **Step 1:** `.gallery .showcase-screen img{ width:100%; height:100%; object-fit: contain; }` and give `.gallery .showcase-screen` a subtle `background: rgba(0,0,0,.04)` (dark: `rgba(255,255,255,.04)`) so contained images read cleanly.
- [ ] **Verify:** build + `npm run dev` on any project detail (e.g. `/artwork/photography/urban/`): portrait and landscape gallery images show fully, uncropped.
- [ ] **Commit:** `Fit detail gallery images without cropping`

## Task 4: Dark-mode button colour parity (item 11)

**Files:** `src/styles/global.css` (mirror the light-only rule at lines ~380-384 for dark)

Light mode gives carousel arrows / subpage arrows / Explore button an explicit hover colour change (`bg → --c-ink`, `color → --c-bg`); dark mode lacks it, so those buttons read as no-change. Add the dark equivalent.

- [ ] **Step 1:** Add after the light rule:
  ```css
  :root[data-theme='dark'] .showcase-arrow:hover,
  :root[data-theme='dark'] .subpage-page-arrow:hover,
  :root[data-theme='dark'] .portfolio-explore .btn:hover{
    background: var(--c-ink); color: var(--c-bg); border-color: var(--c-ink);
  }
  ```
- [ ] **Verify:** build + `npm run dev` in dark mode: hovering the showcase arrows / Explore button now shows the same clear colour flip as light mode.
- [ ] **Commit:** `Match dark-mode button hover colors to light mode`

## Task 5: Hero→section scroll fluidity (item 2)

**Files:** `src/scripts/hero-snap.ts`

The wheel handler `preventDefault()`s then fires one `scrollIntoView({behavior:'smooth'})` to `#design`, locked for 720ms. Carolina reports a "salto raro / cortado" (choppy jump). Make the assisted scroll read as one continuous motion.

- [ ] **Step 1:** Keep the single-gesture snap, but (a) only intercept once per rest-at-top (debounce so trackpad inertia doesn't fire repeatedly), and (b) confirm the target is the first section and the marquee isn't being skipped abruptly — if it is, target the marquee/first-section boundary so the motion is continuous rather than overshooting. Tune the release timeout to the actual smooth-scroll duration.
- [ ] **Verify:** build + `npm run dev`: one downward wheel/trackpad gesture at the top glides smoothly to the first section with no stutter or double-jump; mid-page scroll is unaffected. **Needs Carolina's feel-check** — this is subjective; iterate against her if still not fluid.
- [ ] **Commit:** `Smooth the hero-to-section scroll transition`

## Task 6: Preview margin (item 3)

**Files:** `src/styles/global.css` showcase frame/screen

"Conserva un poco de margen en las previsualizaciones." The `.showcase-screen` already insets 14px inside the frame. Verify against the live build whether the previews lost margin (e.g. loop-carousel neighbours clipped flush to the edge) and restore a small consistent inset if so.

- [ ] **Step 1:** Inspect `npm run dev`; if previews touch the frame/viewport edge, add/raise the inset minimally (don't regress the rounded-corner work from phase 2).
- [ ] **Verify:** build + visual check, light + dark.
- [ ] **Commit:** `Restore margin around showcase previews` *(only if a change is needed)*

## Task 7: Remove the `ui-design` design category (out-of-band request)

> Carolina deleted the `ui-design` section in pagescms.org and it cannot be recreated. The category has **no projects**, so removing it drops an empty bubble and a dead `/design/ui-design/` subpage. `Header.astro:25` and `PortfolioSection`/`SubpageGrid` all filter unknown slugs, so this is safe; we remove every live reference for cleanliness.

**Files:** delete `src/content/categories/design/ui-design.json`; edit `src/components/sections/PortfolioSection.astro:20`, `src/components/layout/Header.astro:19`, `src/content/categories/design/branding.json`, `src/content/categories/design/print.json`. *(Historical mentions in `docs/` and the un-run `scripts/seed-placeholders.mjs` are left as-is — no site impact.)*

- [ ] **Step 1:** `git rm src/content/categories/design/ui-design.json`.
- [ ] **Step 2:** Remove `'ui-design'` from the `design` array in `PortfolioSection.astro:20`.
- [ ] **Step 3:** Remove `'ui-design'` from `DESIGN_ORDER` in `Header.astro:19`.
- [ ] **Step 4:** Remove `"ui-design"` from `sisterCategories` in `branding.json` and `print.json`.
- [ ] **Verify:** `npm run typecheck && npm run lint && npm run build`; confirm no `ui-design` bubble on the home design section, no `/design/ui-design/` in `dist/`, and the mega-menu + sister bubbles no longer list it.
- [ ] **Commit:** `Remove ui-design category from the design section`

---

## Final verification

- [ ] `npm run typecheck && npm run lint && npm run build` — zero warnings.
- [ ] Visual sweep in `npm run dev` (+ `npm run preview` for the built `base` path): home (both portfolio sections), a subpage, a project detail, contact — in **light + dark**, **desktop + mobile**.
- [ ] Hand back to Carolina the blocked/clarification list (items 1, 6, 8, 10) for input. **Do not push — the user owns pushes and the PR.**

---

## Self-Review (completed during planning)

- **Coverage:** all 11 PDF items triaged (table above) — 6 code tasks, 4 flagged blocked/clarify, 1 already-done. ✅
- **Placeholder scan:** code tasks carry concrete edits; tuning items (2, 3) are explicitly marked as needing Carolina's visual confirmation. ✅
- **Risk flags:** item 1 is asset-blocked (no code fix); items 6 & 8 need Carolina to identify the exact view/text; item 10 appears already resolved in current content. ✅
