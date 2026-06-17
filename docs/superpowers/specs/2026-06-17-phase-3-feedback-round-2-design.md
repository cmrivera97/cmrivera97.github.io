# Phase 3 — Feedback Round 2 Design

**Date:** 2026-06-17
**Branch:** `feature/phase-3-feedback-round`
**Source:** `feedback.pdf` — "Observaciones Portfolio Carolina Rivera" (4 pages, 8 items + notes)

## Goal

Apply the third round of Carolina's feedback to the Astro portfolio: hero eyebrow
centering, restore the `ui-design` category, reorder the Skincare project, wire real
social links, update the contact email, enlarge the project-detail carousel so frames
hug the images at full width, remove the "Back to…" button, and fix gallery videos so
they actually play. Two issues (hero-video stub assets and the CMS 2.5 MB upload limit)
are infra/asset-blocked and handed back to Carolina.

## Architecture context

Astro 6 static site, plain CSS with design tokens (`src/styles/`), TypeScript hydration
scripts (`src/scripts/`), bilingual content in `src/content/**` + `src/i18n/{en,es}.json`,
CMS via pagescms.org configured by `.pages.yml`. No unit-test framework — this is a visual
frontend project, so **verification = `npm run typecheck && npm run lint && npm run build`
clean + manual visual check in `npm run dev`** for visual items.

**Commit convention:** `.husky` `commit-msg` hook requires a capitalized infinitive verb
(`Add`, `Fix`, `Update`, `Remove`, `Restyle`…) — no `feat:`/`fix:` prefixes, no
`Co-Authored-By`. One commit per task. **Local commits only — the user owns pushes/PR.**

## Items & approach

### 1. Center the hero eyebrow

`.hero-toprow` is a 3-column grid (`grid-template-columns: 1fr 1fr 1fr`, `global.css:313`).
Since the "since 2019" line was removed last round, the eyebrow is the lone child sitting in
the first column, so `justify-content:center` (`global.css:318`) only centers it within the
left third — it reads as left-aligned.

**Fix:** make the top row a single centered column (e.g. `grid-template-columns: 1fr` with
`justify-items: center`, or `display:flex; justify-content:center`). The eyebrow then centers
relative to the full-width centered `.hero-content`, aligning over "Carolina Rivera".
Orphaned `.hero-since`/`.hero-location` rules may be cleaned up since both elements are gone.

### 2. Restore the `ui-design` design category

Removed in the previous round (commit `57b2f89`); Carolina wants it back. Restore the exact
prior content:

```json
{
  "slug": "ui-design",
  "kind": "design",
  "label": { "en": "UI Design", "es": "Diseño UI" },
  "blurb": {
    "en": "Product surfaces and interactive systems",
    "es": "Productos digitales y sistemas interactivos "
  },
  "sisterCategories": ["branding", "print", "social-media"]
}
```

- Recreate `src/content/categories/design/ui-design.json`.
- Add `'ui-design'` to `CATEGORY_ORDER.design` in `PortfolioSection.astro:20`.
- Add `'ui-design'` to `DESIGN_ORDER` in `Header.astro:19`.
- Re-add `"ui-design"` to the `sisterCategories` arrays where it belonged before
  (it previously listed branding/print/social-media as sisters, and those listed it back —
  match the prior reciprocal pattern: add to `branding.json` and `print.json`).
- CMS: pagescms.org reads categories from the repo via `.pages.yml`, so the restored JSON
  reappears in the CMS automatically. No `.pages.yml` change needed.

**Note:** the category has **no projects**, so it renders an empty bubble + an empty
`/design/ui-design/` subpage until Carolina adds projects via the CMS. This is intended.

### 3. Move Skincare from 3rd to 2nd in the AI Designs carousel

Projects sort by `a.id.localeCompare(b.id)` (file id), so display order follows filename.
Current order: `2026-06-07-makeup`, `2026-06-09-skin-carousel`, `2026-06-09-skincare`,
`2026-06-09-therian-carousel`.

**Fix:** `git mv` `2026-06-09-skincare.json` → `2026-06-08-skincare.json` so it sorts before
`skin-carousel`. New order: Makeup, Skincare, Skin Carrusel, Therian. The internal `slug`,
`title`, and other fields stay unchanged (only the filename/date prefix changes).

### 4. Wire real social-media links

Replace placeholder hrefs in **both** `Contact.astro` (lines ~13-43) and `Footer.astro`
(lines ~12-37):

- Behance: `https://www.behance.net/carolinamrivera`
- Instagram: `https://www.instagram.com/cmriverartist/`
- LinkedIn: `https://www.linkedin.com/in/carolina-rivera-1510b1245/`
- WhatsApp: `https://wa.link/h740eo`

### 5. Update the contact email

Change `contact.email` from `hello@carolinariverart.com` to `cm.rivera1597@gmail.com` in
`src/i18n/en.json:52` and `src/i18n/es.json:52` (single source — `Contact.astro` reads it via
`t('contact.email')`, used for both display and the copy/mailto action).

### 6+7. Detail carousel: full width, bigger images, frame hugs image

**Decision (user):** keep the glass frame, but make it hug the image and widen the active
card toward the viewport.

Current state (`global.css`):
- `.showcase-frame` `padding: 14px` (`:410`) and `.showcase-screen` `inset: 14px` (`:445`)
  → ~28px gap between image and frame edge (the "cuadro delimitador larger than image"
  problem in the sketch).
- `.gallery .showcase-card` `flex-basis: clamp(520px, 80cqw, 920px)` (`:1086`) — capped at
  920px, not full width.
- `.gallery .showcase-screen img` `object-fit: contain` (`:1085`) letterboxes inside a fixed
  box.

**Fix (gallery scope only — do not regress the home showcase):**
- Remove the inner padding/inset for gallery frames so the glass frame wraps tightly to the
  image (frame size == image size). Approach: in the gallery, let the image define the box
  (image in normal flow, `width:100%; height:auto; display:block`) and the frame wrap it
  (drop the absolute-positioned `inset` + fixed `aspect-ratio` for gallery), so there is no
  letterbox gap and the frame border sits on the image edge.
- Widen the active gallery card toward full viewport width minus page margins
  (e.g. raise the `flex-basis` clamp ceiling substantially / use `min(…, 100%)`), keeping the
  side neighbours visible. Exact values tuned against the live build.
- Preserve image proportion (no crop).

Keep the rounded glass aesthetic (border-radius, backdrop blur, shadow). Verify in light +
dark and at mobile widths that neighbours and arrows still lay out correctly.

### 8. Remove the "← Back to <Category>" button

Delete the `.detail-back` anchor in `ProjectDetail.astro:21-26` and its now-orphan CSS
(`.detail-back{ margin-bottom:30px }`, `global.css:1068`). Check there is no equivalent
back-button on subpages (`SubpageGrid.astro`) — the feedback says "or any other subsection".

### Video fix — gallery videos don't play

**Root cause (bug):** `Gallery.astro:22-29` maps **every** gallery item to `kind: 'image'`,
so a project's `kind:'video'` item (e.g. makeup's `/images/tocobo.mp4`, a real 1.3 MB file)
renders inside an `<img>` tag and cannot play.

**Fix:** preserve each gallery item's real `kind`. For `kind:'video'`, render a
`<video autoplay muted loop playsinline preload="metadata">` (or with controls) inside the
`.showcase-screen` instead of `<img>`. Add matching CSS so `.showcase-screen video` sizes like
the image (`width:100%; height:100%; object-fit` consistent with the new gallery sizing).
The `Slide` type and the home-showcase path must still work (home showcase passes its own
items; ensure that path is unaffected or also kind-aware as appropriate).

## Flagged — no code fix (hand back to Carolina)

- **Hero videos:** `public/video/d2.mp4`, `hero-h-dark.mp4`, `hero-v-dark.mp4` are 132–133-byte
  stub files. Markup/script are correct; they need real `.mp4` footage (same filenames) in
  `public/video/`. Posters render meanwhile.
- **2.5 MB upload limit:** a pagescms.org/GitHub commit-size constraint (one existing asset,
  `H5-Black-Days-Self (1).mp4`, is already 2.68 MB and likely failed to upload via the CMS).
  Not controllable from site code. Options if pursued later: compress videos under the limit,
  Git LFS, or external video hosting — out of scope for this round.

## Verification

- `npm run typecheck && npm run lint && npm run build` — zero warnings.
- `npm run dev` visual sweep: hero eyebrow centered (1); design section shows the UI Design
  bubble (2); AI Designs carousel order is Makeup → Skincare → Skin Carrusel → Therian (3);
  social buttons open correct URLs (4); contact email is the new address (5); detail gallery
  images are large with frames hugging them, uncropped, full width (6/7); no Back button (8);
  the makeup project's Tocobo video plays in the gallery (video fix).
- Check light + dark, desktop + mobile.
- Hand back the flagged items (hero footage, upload limit) to Carolina.

## Self-review

- **Coverage:** all 8 PDF items + the video note triaged — 7 code/content tasks, 1 code bug
  fix, 2 flagged blocked. ✅
- **Placeholders:** none; carousel sizing values are explicitly "tuned against live build". ✅
- **Consistency:** item 2 reverses last round's removal (intentional, per feedback). ✅
- **Ambiguity:** item 3 interpretation confirmed with user (project reorder, not inner gallery
  images). Carousel aggressiveness confirmed (hug frame, keep glass). Video scope confirmed. ✅
