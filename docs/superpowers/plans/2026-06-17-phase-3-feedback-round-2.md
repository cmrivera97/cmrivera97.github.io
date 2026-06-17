# Phase 3 — Feedback Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the third round of Carolina's `feedback.pdf` (8 items + a video note) to the Astro portfolio: center the hero eyebrow, restore the `ui-design` category, reorder the Skincare project, wire real social links, update the contact email, enlarge the detail carousel so frames hug images at full width, remove the back buttons, and fix gallery videos so they play.

**Architecture:** Astro 6 static site, plain CSS with design tokens (`src/styles/`), TypeScript hydration scripts (`src/scripts/`), bilingual content in `src/content/**` + `src/i18n/{en,es}.json`, CMS via pagescms.org (`.pages.yml`). All changes are content, i18n, CSS, and small `.astro`/`.ts` edits. No unit-test framework exists; this is a visual frontend project, so **verification = `npm run typecheck && npm run lint && npm run build` all clean, plus a manual visual check in `npm run dev`** for the visual items (1, 6/7, gallery video).

**Tech Stack:** Astro 6.3.1, TypeScript, plain CSS, ESLint (airbnb-base, `--max-warnings=0`), `astro check`.

> **Commit convention (Jericho + project memory):** the `.husky` `commit-msg` hook requires messages starting with a **capitalized infinitive verb** (`Add`, `Fix`, `Update`, `Remove`, `Restyle`…) — **no** `feat:`/`fix:` prefixes and **no** `Co-Authored-By` trailer. TypeScript edits keep explicit return types, single quotes, semicolons, labeled import groups. **Commit locally only — the user owns all pushes / the PR.** Branch: `feature/phase-3-feedback-round`.

---

## Source feedback (verbatim from the PDF)

1. The "GRAPHIC DESIGNER" eyebrow in the hero should be centered relative to "Carolina Rivera".
2. Re-add the "UI Design" category to the design categories (existed before, deleted from the CMS).
3. The 3rd "Skincare" item in the AI Designs carousel should move to 2nd position.
4. Link the social buttons (Behance, Instagram, LinkedIn, WhatsApp) to their real URLs.
5. Change the contact email to `cm.rivera1597@gmail.com`.
6. Use the full screen width for the image carousel; enlarge images respecting original proportion, using full width with margins (red border = target proportion).
7. Enlarge carousel images respecting proportion; the bounding frame must be the same size as the image.
8. Remove the "← Back to…" button at the top of projects (and any other subsection).
- **Notes:** Videos don't play; can't upload videos over 2.5 MB.

## File map

| File | Change |
|------|--------|
| `src/styles/global.css` | eyebrow centering (313); detail-back CSS removal (1068); subpage-back CSS removal (665-673); gallery sizing (1080-1087); add `video` rules (447, 1085) |
| `src/content/categories/design/ui-design.json` | **create** (restore) |
| `src/components/sections/PortfolioSection.astro` | add `'ui-design'` to `CATEGORY_ORDER.design` (20) |
| `src/components/layout/Header.astro` | add `'ui-design'` to `DESIGN_ORDER` (19) |
| `src/content/categories/design/branding.json` | add `"ui-design"` to `sisterCategories` |
| `src/content/categories/design/print.json` | add `"ui-design"` to `sisterCategories` |
| `src/content/projects/design/ai-designs/2026-06-09-skincare.json` | **rename** → `2026-06-08-skincare.json` |
| `src/components/sections/Contact.astro` | real social hrefs (21,27,33,39) |
| `src/components/layout/Footer.astro` | real social hrefs (15,21,27,33) |
| `src/i18n/en.json` | `contact.email` (52) |
| `src/i18n/es.json` | `contact.email` (52) |
| `src/components/visual/Gallery.astro` | render `<video>` for `kind:'video'` (18-36, 46-57) |
| `src/components/sections/ProjectDetail.astro` | delete `.detail-back` anchor (22-26) |
| `src/components/sections/SubpageGrid.astro` | delete `.subpage-back` anchor (38) |

---

## Task 1: Wire social links and update the contact email (items 4, 5)

**Files:**
- Modify: `src/components/sections/Contact.astro:21,27,33,39`
- Modify: `src/components/layout/Footer.astro:15,21,27,33`
- Modify: `src/i18n/en.json:52`
- Modify: `src/i18n/es.json:52`

- [ ] **Step 1: Update the four social hrefs in `Contact.astro`.** Replace the placeholder URLs in the `socials` array:
  - `behance` `href`: `'https://www.behance.net/'` → `'https://www.behance.net/carolinamrivera'`
  - `instagram` `href`: `'https://www.instagram.com/'` → `'https://www.instagram.com/cmriverartist/'`
  - `linkedin` `href`: `'https://www.linkedin.com/'` → `'https://www.linkedin.com/in/carolina-rivera-1510b1245/'`
  - `whatsapp` `href`: `'https://wa.me/'` → `'https://wa.link/h740eo'`

- [ ] **Step 2: Make the identical four edits in `Footer.astro`** (its `socials` array uses the same keys/placeholder URLs at lines 15, 21, 27, 33).

- [ ] **Step 3: Update the email in both i18n files.** In `src/i18n/en.json:52` and `src/i18n/es.json:52`:
  ```json
      "email": "cm.rivera1597@gmail.com",
  ```
  (`Contact.astro` reads it via `t('contact.email')` for both the displayed address and the `mailto:`/copy action, so this single edit covers display + form.)

- [ ] **Step 4: Verify.**
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass, zero warnings. Then `npm run dev` → Contact section shows `cm.rivera1597@gmail.com`; the four social buttons (footer + contact) open the correct profiles in a new tab.

- [ ] **Step 5: Commit.**
  ```bash
  git add src/components/sections/Contact.astro src/components/layout/Footer.astro src/i18n/en.json src/i18n/es.json
  git commit -m "Wire social links and update contact email"
  ```

## Task 2: Move the Skincare project to 2nd position (item 3)

**Files:**
- Rename: `src/content/projects/design/ai-designs/2026-06-09-skincare.json` → `src/content/projects/design/ai-designs/2026-06-08-skincare.json`

Projects sort by `a.id.localeCompare(b.id)` (the file path/name), so display order follows the filename's date prefix. Current order: `2026-06-07-makeup`, `2026-06-09-skin-carousel`, `2026-06-09-skincare`, `2026-06-09-therian-carousel`. Renaming `skincare` to a `2026-06-08` prefix sorts it before `skin-carousel` → new order: **Makeup, Skincare, Skin Carrusel, Therian**. Only the filename changes; the internal `slug`/`title`/fields stay the same.

- [ ] **Step 1: Rename the file via git.**
  ```bash
  git mv src/content/projects/design/ai-designs/2026-06-09-skincare.json src/content/projects/design/ai-designs/2026-06-08-skincare.json
  ```

- [ ] **Step 2: Verify.**
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass. Then `npm run dev` → on the home design section (AI Designs) and `/design/ai-designs/`, the carousel order is Makeup → Skincare → Skin Carrusel → Therian. Confirm the Skincare project page still builds at its slug-based URL (the route uses `slug`, unchanged).

- [ ] **Step 3: Commit.**
  ```bash
  git add -A src/content/projects/design/ai-designs/
  git commit -m "Move Skincare project to second position in AI Designs"
  ```

## Task 3: Restore the `ui-design` design category (item 2)

**Files:**
- Create: `src/content/categories/design/ui-design.json`
- Modify: `src/components/sections/PortfolioSection.astro:20`
- Modify: `src/components/layout/Header.astro:19`
- Modify: `src/content/categories/design/branding.json`
- Modify: `src/content/categories/design/print.json`

This reverses the previous round's removal (commit `57b2f89`); content is the exact prior file. The category has **no projects**, so it intentionally renders an empty bubble + empty `/design/ui-design/` subpage until Carolina adds projects via the CMS (pagescms.org reads categories from the repo, so the restored JSON reappears in the CMS automatically — no `.pages.yml` change).

- [ ] **Step 1: Create `src/content/categories/design/ui-design.json`** with the exact restored content:
  ```json
  {
    "slug": "ui-design",
    "kind": "design",
    "label": {
      "en": "UI Design",
      "es": "Diseño UI"
    },
    "blurb": {
      "en": "Product surfaces and interactive systems",
      "es": "Productos digitales y sistemas interactivos "
    },
    "sisterCategories": [
      "branding",
      "print",
      "social-media"
    ]
  }
  ```

- [ ] **Step 2: Add `'ui-design'` to `CATEGORY_ORDER.design` in `PortfolioSection.astro:20`.** Change:
  ```ts
    design: ['ai-designs', 'social-media', 'branding', 'print', 'illustration'],
  ```
  to:
  ```ts
    design: ['ai-designs', 'social-media', 'branding', 'print', 'illustration', 'ui-design'],
  ```

- [ ] **Step 3: Add `'ui-design'` to `DESIGN_ORDER` in `Header.astro:19`.** Change:
  ```ts
  const DESIGN_ORDER = ['ai-designs', 'social-media', 'branding', 'print', 'illustration'];
  ```
  to:
  ```ts
  const DESIGN_ORDER = ['ai-designs', 'social-media', 'branding', 'print', 'illustration', 'ui-design'];
  ```

- [ ] **Step 4: Restore the reciprocal `sisterCategories` entries** (matching the pre-removal state). In `branding.json`:
  ```json
    "sisterCategories": ["social-media", "print", "ui-design"]
  ```
  In `print.json`:
  ```json
    "sisterCategories": ["branding", "illustration", "ui-design"]
  ```

- [ ] **Step 5: Verify.**
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass. Then `npm run dev` → the home design section shows a "UI Design" bubble; the mega-menu lists UI Design; `/design/ui-design/` builds (empty grid is fine); branding/print subpages show UI Design among sister categories.

- [ ] **Step 6: Commit.**
  ```bash
  git add src/content/categories/design/ui-design.json src/components/sections/PortfolioSection.astro src/components/layout/Header.astro src/content/categories/design/branding.json src/content/categories/design/print.json
  git commit -m "Restore ui-design category in the design section"
  ```

## Task 4: Center the hero eyebrow (item 1)

**Files:**
- Modify: `src/styles/global.css:313`

`.hero-toprow` is a 3-column grid; since the "since 2019" line was removed last round, the eyebrow is the lone child sitting in the first column, so it reads as left-aligned. Switch the row to a single centered flex row so the eyebrow centers over the (centered) "Carolina Rivera" title.

- [ ] **Step 1: Change the `.hero-toprow` rule at line 313.** From:
  ```css
  .hero-toprow{ display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; margin-bottom: 30px; }
  ```
  to:
  ```css
  .hero-toprow{ display: flex; justify-content: center; align-items: center; margin-bottom: 30px; }
  ```
  (Leave the now-orphan `.hero-since`/`.hero-location` rules at lines 314-317 and `.hero-eyebrow{ justify-content: center }` at 318 in place — harmless; both elements are already gone.)

- [ ] **Step 2: Verify.**
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass. Then `npm run dev` on `/` and `/es/` → "— GRAPHIC DESIGNER · VISUAL ARTIST" is horizontally centered above "Carolina", in light + dark.

- [ ] **Step 3: Commit.**
  ```bash
  git add src/styles/global.css
  git commit -m "Center the hero eyebrow over the name"
  ```

## Task 5: Remove the "Back to…" buttons (item 8)

**Files:**
- Modify: `src/components/sections/ProjectDetail.astro:22-26` (delete the `.detail-back` anchor)
- Modify: `src/components/sections/SubpageGrid.astro:38` (delete the `.subpage-back` anchor)
- Modify: `src/styles/global.css:1068` (remove `.detail-back` rule) and `:665-673` (remove `.subpage-back` rule)

The feedback circles the project-detail back button and says "or any other subsection that exists" — there are two: `.detail-back` (project pages) and `.subpage-back` (category subpages). Remove both buttons and their CSS. The `detail.back` / `subpage.back` i18n keys become orphaned but are harmless; leave them.

- [ ] **Step 1: Delete the `.detail-back` anchor in `ProjectDetail.astro`** (lines 22-26, the whole `<a class="btn btn-glass detail-back" …>← {t('detail.back')} {category.data.label[lang]}</a>` element), so `<section class="detail">` is immediately followed by `<div class="detail-head">`.

- [ ] **Step 2: Delete the `.subpage-back` anchor in `SubpageGrid.astro:38`** (the line `<a class="subpage-back" href={homeHref} data-cursor="link">← {t('subpage.back')} {kindLabel}</a>`), so `<section class="subpage">` is immediately followed by `<div class="subpage-head">`. The now-unused `homeHref` const (line 34) is no longer referenced — remove that line too to satisfy `no-unused-vars`.

- [ ] **Step 3: Remove the orphan CSS.** Delete `.detail-back{ margin-bottom: 30px; }` (global.css:1068) and the entire `.subpage-back { … }` rule (global.css:665-673).

- [ ] **Step 4: Verify.**
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass (no `no-unused-vars` for `homeHref`). Then `npm run dev` → no back button at the top of any project detail page or any `/design/<cat>/` · `/artwork/<cat>/` subpage; layout spacing below still looks right.

- [ ] **Step 5: Commit.**
  ```bash
  git add src/components/sections/ProjectDetail.astro src/components/sections/SubpageGrid.astro src/styles/global.css
  git commit -m "Remove the back buttons from project and category pages"
  ```

## Task 6: Fix gallery videos so they play (video note)

**Files:**
- Modify: `src/components/visual/Gallery.astro:18-36,46-57`
- Modify: `src/styles/global.css` (add `video` rules at ~447 and ~1085)

**Root cause:** `Gallery.astro` forces every gallery item to `kind: 'image'` (line 24), so a `kind:'video'` item (e.g. the makeup project's `/images/tocobo.mp4`, a real 1.3 MB file) renders inside an `<img>` and can't play. Preserve each item's real `kind` and render `<video>` for videos.

- [ ] **Step 1: Update the `Slide` type (lines 18-20)** so image and video share a media shape:
  ```ts
  type MediaSlide = { kind: 'image' | 'video'; key: string; src: string; alt: string };
  type Slide =
    | MediaSlide
    | { kind: 'placeholder'; key: string; hue: number };
  ```

- [ ] **Step 2: Preserve the real `kind` in the gallery map (lines 23-29).** Change the `if` branch to:
  ```ts
  if (project.data.gallery.length > 0) {
    slides = project.data.gallery.map((item, i): Slide => ({
      kind: item.kind,
      key: `${project.data.slug}-${i}`,
      src: item.src,
      alt: item.alt[lang],
    }));
  } else {
  ```
  (The `else` placeholder branch stays unchanged.)

- [ ] **Step 3: Render `<video>` for video slides (lines 50-53).** Replace the screen-content expression:
  ```astro
            {s.kind === 'placeholder' && <Placeholder hue={s.hue} glyph="◆" />}
            {s.kind === 'image' && (
              <img src={withBase(s.src)} alt={s.alt} loading="lazy" decoding="async" />
            )}
            {s.kind === 'video' && (
              <video
                src={withBase(s.src)}
                autoplay muted loop playsinline preload="metadata"
                aria-label={s.alt}
              ></video>
            )}
  ```

- [ ] **Step 4: Add CSS so videos size like images.** In `global.css`, beside the base image rule at line 447 add:
  ```css
  .showcase-screen > video{ width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit; }
  ```
  and beside the gallery image override at line 1085 add `video` to the selector:
  ```css
  .gallery .showcase-screen img,
  .gallery .showcase-screen video{ width: 100%; height: 100%; object-fit: contain; }
  ```

- [ ] **Step 5: Verify.**
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass. Then `npm run dev` → open the Makeup project detail (`/design/ai-designs/<makeup-slug>/`); the 2nd gallery item (Tocobo) is a video that autoplays muted and loops; images in the same gallery still render normally.

- [ ] **Step 6: Commit.**
  ```bash
  git add src/components/visual/Gallery.astro src/styles/global.css
  git commit -m "Render gallery videos as playable video elements"
  ```

## Task 7: Detail carousel — full width, bigger images, frame hugs image (items 6, 7)

**Files:**
- Modify: `src/styles/global.css:1080-1087` (the `.gallery` overrides)

**Decision (user-approved):** keep the glass frame, but make it hug the image (no inner padding band → frame edge sits on the image) and widen the active card toward the viewport. The gallery is a coverflow (`carousel.ts` `COVERFLOW` config) whose step spacing derives from each card's measured `offsetWidth`, so widening cards via CSS scales the layout automatically.

Current overrides (lines 1080-1087) box images into a fixed 16/11 frame with a 14px padding + 14px inset glass band and a max card width of ~600px (loop card width is `clamp(360px, 50cqw, 600px)` at line 436; `.gallery` is capped inside the 1100px `.detail` container). We full-bleed the gallery, drop the inner band, and let the image define the frame height.

- [ ] **Step 1: Replace the `.gallery` override block (lines 1080-1087)** with:
  ```css
  .gallery{ margin: 40px 0; container-type: inline-size;
    width: 100vw; margin-left: calc(50% - 50vw); }
  /* Detail ("vista final") gallery: the glass frame hugs the image at its natural
     proportion (cuadro delimitador == imagen) and never crops. */
  .gallery .showcase-track[data-carousel='loop']{ height: min(78vh, 760px); }
  .gallery .showcase-track[data-carousel='loop'] .showcase-card{
    width: clamp(320px, 60cqw, 980px); height: auto; aspect-ratio: auto; }
  .gallery .showcase-frame{ position: relative; inset: auto; padding: 0; aspect-ratio: auto;
    width: 100%; height: 100%; }
  .gallery .showcase-screen{ position: relative; inset: 0; border-radius: inherit; background: transparent; }
  :root[data-theme='dark'] .gallery .showcase-screen{ background: transparent; }
  .gallery .showcase-screen img,
  .gallery .showcase-screen video{
    width: 100%; height: 100%; max-height: min(78vh, 760px);
    object-fit: contain; display: block; }
  ```
  Notes for the implementer: the `.showcase-frame`/`.showcase-screen` here override the base absolute-positioned rules (410, 445) **for galleries only** — the home showcase keeps its existing look. Keep the frame's glass background/border/radius from the base rule (don't null them) so the glass aesthetic survives.

- [ ] **Step 2: Verify and tune against the live build.** This item is visual; tune the values until it matches the feedback's red-border reference.
  Run: `npm run typecheck && npm run lint && npm run build`, then `npm run dev` and check:
  - A landscape gallery (Makeup) and a portrait one (Skincare): the active image is large and spans toward the full viewport width (with page margins), uncropped, with the glass frame hugging the image edges (no visible glass band/letterbox gap).
  - Side neighbours still peek and dim; arrows + dots still work; clicking a side card centers it.
  - Light + dark, desktop + mobile (≤980px and ≤640px) — adjust the `width` clamp and track `height` (`min(78vh,760px)`) if neighbours collide or a tall portrait overflows the nav.
  If a value needs changing, edit and re-run dev; this is expected tuning, not a defect.

- [ ] **Step 3: Commit.**
  ```bash
  git add src/styles/global.css
  git commit -m "Enlarge detail carousel to full width with image-hugging frames"
  ```

---

## Flagged — no code fix (hand back to Carolina)

These are reported in the plan but are **not** implementable here:

- **Hero videos don't play:** `public/video/d2.mp4`, `hero-h-dark.mp4`, `hero-v-dark.mp4` are 132–133-byte stub files. The markup (`Hero.astro`) and `hero-video.ts` are correct — they need real `.mp4` footage (same filenames) dropped into `public/video/`. Posters render meanwhile. *(The gallery-video bug is separate and fixed in Task 6.)*
- **2.5 MB upload limit:** a pagescms.org/GitHub commit-size constraint (one existing asset, `H5-Black-Days-Self (1).mp4`, is already 2.68 MB and likely failed to upload via the CMS). Not controllable from site code. If pursued later: compress videos under the limit, use Git LFS, or host videos externally — out of scope for this round.

## Final verification

- [ ] `npm run typecheck && npm run lint && npm run build` — zero warnings.
- [ ] `npm run dev` visual sweep, **light + dark, desktop + mobile**:
  - hero eyebrow centered over the name (Task 4);
  - UI Design bubble on the home design section + in the mega-menu (Task 3);
  - AI Designs carousel order Makeup → Skincare → Skin Carrusel → Therian (Task 2);
  - social buttons open the correct URLs; contact email is `cm.rivera1597@gmail.com` (Task 1);
  - Makeup gallery's Tocobo video plays (Task 6);
  - detail gallery images large, full width, frame hugging, uncropped (Task 7);
  - no back button on project detail or category subpages (Task 5).
- [ ] `npm run preview` once to confirm the built `base` path renders the same.
- [ ] Hand Carolina the flagged items (hero footage, 2.5 MB upload limit). **Do not push — the user owns pushes and the PR.**

---

## Self-Review (completed during planning)

- **Spec coverage:** all 8 PDF items + the video note map to a task — Task 1 (items 4,5), Task 2 (item 3), Task 3 (item 2), Task 4 (item 1), Task 5 (item 8, both back buttons), Task 6 (video note bug), Task 7 (items 6,7). Hero-video stubs + 2.5 MB limit flagged. ✅
- **Placeholder scan:** every code step shows concrete code; Task 7 carries concrete starting CSS plus an explicit (non-placeholder) tuning step — standard for this visual project. ✅
- **Type consistency:** `MediaSlide`/`Slide` defined in Task 6 Step 1 and used consistently in Steps 2-3; `item.kind` comes from the existing `galleryItem` zod schema (`z.enum(['image','video'])`). CSS selectors reference existing classes (`.showcase-frame`, `.showcase-screen`, `.showcase-card`, loop track). ✅
- **Risk flags:** Task 7 is the only judgment-heavy change (coverflow + full-bleed) and is explicitly marked tune-against-live; Task 3 intentionally reverses the prior round's removal; Task 5 removes a const (`homeHref`) to keep lint clean. ✅
