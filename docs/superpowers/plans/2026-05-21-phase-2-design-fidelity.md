# Phase 2 — Design Fidelity, Video Hero & Project Detail Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve every note in Carolina's `feedback.pdf` by restoring faithful fidelity to the original Claude Design prototype (`docs/design-reference/dreamy.jsx`), replacing the SVG-jellyfish hero with her supplied background videos, building reusable per-project detail pages, and applying a real responsive pass.

**Architecture:** The current Astro build drifted heavily from the prototype. We port the prototype's markup/CSS/motion into the existing Astro stack (Astro components + content collections + i18n + vanilla-TS island scripts), keeping the build-time-data / events-up patterns. We do **not** introduce React or Three.js. The hero's animated jellyfish become an autoplay/muted/looping `<video>` (light/dark × horizontal/vertical) with a poster + reduced-motion fallback. Project cards route to new static detail pages generated from the `projects` collection.

**Tech Stack:** Astro 6, TypeScript (strict), plain CSS (design tokens in `src/styles/tokens.css` + `global.css`), vanilla-TS island scripts in `src/scripts/`, Google Fonts (Montserrat/Fraunces/Jost/Caveat), Git LFS for video binaries, ffmpeg (transcode + poster) and exiftool (metadata strip) at asset-prep time.

---

## Authoritative reference

- **Prototype (source of truth):** `docs/design-reference/dreamy.jsx` (layout/CSS/motion) and `docs/design-reference/shared.jsx` (i18n strings, PROJECTS data, cursor, splash, marquee, Reveal).
- **Sketches:** `docs/design-reference/uploads/Ref Home.jpeg`, `Ref Subpage.jpeg`, `Ref Contact.jpeg`.
- **Feedback:** `feedback.pdf` (repo root). Each note is tagged #1–#21 below.
- When a task says "match prototype," open the cited `dreamy.jsx`/`shared.jsx` line range and copy the exact values (colors, sizes, timings, copy). Exact values are also inlined here.

## Locked decisions (do not re-litigate)
- Per-project detail pages **are in scope** (Carolina confirmed). Add a bilingual `overview` field to the schema; carousel uses placeholder covers until real images arrive.
- Hero uses Carolina's **background videos** (in `/home/jorius/Downloads/wetransfer_finales_2026-05-21_0231/FINALES/`); SVG jellyfish are retired from the hero. "Fix only UI/UX, animations and transitions."
- Videos tracked via **Git LFS**. Optimize with ffmpeg; strip metadata with exiftool (privacy rule).
- Tokens stay: accent `#7A8FF7`, light ink `#34363f`, light bg `#f4f6fc`, dark ink ≈`#f0f2fc`, dark bg `#0c0e1c`. Fonts: Montserrat / Fraunces (italic accents) / Jost (was for "Carolina" — see Hero) / Caveat. Add **Italianno** to the font link (prototype lists it; used nowhere critical — include for parity, optional).
- Branch: `feature/phase-2-design-fidelity` off `main`. Integrate with **merge** only (never rebase). **No `Co-Authored-By` trailer** (design phase). Jericho commit style (capitalized infinitive subject, ≤72 chars, body explains why).
- EN/ES parity guard must stay green (every new i18n key in both `en.json` and `es.json`).

## Out of scope
- Real project copy/images (Carolina supplies later; placeholders hold structure). Real-photo EXIF strip binds when real images land.
- Backend for the contact form (mailto/no-op submit as today).
- SEO/OG/analytics; custom domain.

## Files map (created / modified)

**Config & assets**
- `.gitattributes` — create (LFS tracking for `*.mp4`, poster `*.jpg` left normal).
- `public/video/` — create; optimized hero cuts + posters.
- `scripts/prep-video.sh` — create; documents/repeats the ffmpeg+exiftool transcode.
- `src/content.config.ts` — modify; add `overview: langString.optional()` to `projects`.
- `src/styles/tokens.css` — modify; add glass/nav/mega tokens, retune motion durations.
- `src/styles/global.css` — heavy modify; port prototype component CSS.

**Layout & nav**
- `src/components/layout/Header.astro` — rewrite; floating glass-pill nav + full-width mega-menu.
- `src/components/layout/BaseLayout.astro` — modify; mega-menu island, ensure header overlays hero.
- `src/scripts/mega-menu.ts` — create; open/close + keyboard a11y for mega-menu.

**Hero**
- `src/components/sections/Hero.astro` — rewrite; `<video>` bg (theme/orientation `<source>`s) + poster + entrance + two CTAs + scroll hint.
- `src/scripts/hero-video.ts` — create; theme/orientation source swap, reduced-motion pause, scroll parallax/fade.
- `src/components/visual/Jellyfish.astro`, `Sparkles.astro`, `src/scripts/jellyfish-drift.ts` — retire from hero (keep files or delete; see Task 4.4).

**Portfolio sections**
- `src/components/sections/PortfolioSection.astro` — modify; add intro banner, left-align, explore button.
- `src/components/sections/Showcase.astro` — rewrite; glass frame, title-inside-gradient card, dots, circular nav, cursor label, first-card-active.
- `src/scripts/carousel.ts` — modify; center-active detection + initial center on card 0 + dots sync.
- `src/scripts/bubble-selector.ts` — modify; active gradient bubble + reset to card 0 on category change.

**Subpages & detail**
- `src/components/sections/SubpageGrid.astro` — modify; faithful tilted 4-col grid, pagination, sister bubbles, footer strip; cards link to detail pages.
- `src/components/sections/ProjectDetail.astro` — create; reusable detail template.
- `src/components/visual/Gallery.astro` — create; image carousel for detail page.
- `src/pages/design/[category]/[project].astro` — create; EN detail route.
- `src/pages/artwork/[category]/[project].astro` — create; EN detail route.
- `src/pages/es/design/[category]/[project].astro`, `src/pages/es/artwork/[category]/[project].astro` — create; ES mirrors.

**Contact & motion**
- `src/components/sections/Contact.astro` — rewrite; "Let's make something", 3 lines, glass email card, form, 4 social bubbles.
- `src/scripts/splash.ts` — rewrite; random scatter + blob shapes, slower, less rotation.
- `src/scripts/cursor.ts` — modify; render `data-cursor-label` inside ring on `media`.
- `src/components/visual/Marquee.astro` + `src/scripts/marquee.ts` — modify; big Fraunces-italic, seamless multi-copy loop.

**i18n**
- `src/i18n/en.json`, `src/i18n/es.json` — modify; add keys (hero CTAs, sections titles, explore, contact lines, detail labels, mega blurbs).

---

## Task group A — Branch, LFS, video assets

### Task A1: Create branch
- [ ] **Step 1:** Create and switch to the feature branch.
```bash
cd /media/jorius/MEDIA/Sources/GitHub/Private/portfolio-web-app-ciruela
git checkout -b feature/phase-2-design-fidelity
```
- [ ] **Step 2:** Commit the already-staged reference docs.
```bash
git add docs/design-reference docs/superpowers/plans/2026-05-21-phase-2-design-fidelity.md
git commit -m "Add Phase 2 plan and design reference bundle"
```

### Task A2: Configure Git LFS for video
**Files:** Create `.gitattributes`
- [ ] **Step 1:** Verify prerequisites are installed (user task). Expected: all print a path.
```bash
ffmpeg -version | head -1; ffprobe -version | head -1; exiftool -ver; git lfs version
```
If any are missing, stop and ask the user to run: `sudo apt update && sudo apt install -y ffmpeg libimage-exiftool-perl git-lfs && git lfs install`.
- [ ] **Step 2:** Track mp4 via LFS.
```bash
git lfs track "public/video/*.mp4"
```
- [ ] **Step 3:** Confirm `.gitattributes` contains the line, then commit.
```bash
git add .gitattributes && git commit -m "Track hero videos with Git LFS"
```

### Task A3: Inspect, transcode, poster, strip metadata
**Files:** Create `public/video/`, `scripts/prep-video.sh`
Source dir: `/home/jorius/Downloads/wetransfer_finales_2026-05-21_0231/FINALES/`
Source files → output names:
- `01 Medusas horizontal dark 2.0.mp4` → `hero-h-dark.mp4`
- `01 Medusas horizontal light 2.0.mp4` → `hero-h-light.mp4`
- `02 Medusa Vertical Dark.mp4` → `hero-v-dark.mp4`
- `02 Medusa Vertical Light.mp4` → `hero-v-light.mp4`

- [ ] **Step 1:** Probe each source (resolution/duration/audio) and record results in a comment in `scripts/prep-video.sh`.
```bash
for f in "01 Medusas horizontal dark 2.0" "01 Medusas horizontal light 2.0" "02 Medusa Vertical Dark" "02 Medusa Vertical Light"; do
  echo "== $f =="; ffprobe -v error -show_entries stream=codec_type,width,height,duration,bit_rate -of default=noprint_wrappers=1 "/home/jorius/Downloads/wetransfer_finales_2026-05-21_0231/FINALES/$f.mp4"; done
```
- [ ] **Step 2:** Write `scripts/prep-video.sh` performing: transcode to web H.264 (target ~2–4 MB, scale to max 1920w for horizontal / 1080w for vertical, `-movflags +faststart`, drop audio with `-an`), generate a poster from frame ~0.5s, strip metadata.
```bash
#!/usr/bin/env bash
set -euo pipefail
SRC="/home/jorius/Downloads/wetransfer_finales_2026-05-21_0231/FINALES"
OUT="public/video"
mkdir -p "$OUT"
transcode () { # $1 src  $2 outbase  $3 maxw
  ffmpeg -y -i "$SRC/$1" -an -vf "scale='min($3,iw)':-2" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart \
    "$OUT/$2.mp4"
  ffmpeg -y -ss 0.5 -i "$OUT/$2.mp4" -frames:v 1 -q:v 4 "$OUT/$2-poster.jpg"
  exiftool -all= -overwrite_original "$OUT/$2.mp4" "$OUT/$2-poster.jpg"
}
transcode "01 Medusas horizontal dark 2.0.mp4"  hero-h-dark  1920
transcode "01 Medusas horizontal light 2.0.mp4" hero-h-light 1920
transcode "02 Medusa Vertical Dark.mp4"         hero-v-dark  1080
transcode "02 Medusa Vertical Light.mp4"        hero-v-light 1080
echo "sizes:"; ls -lh "$OUT"
```
- [ ] **Step 3:** Run it. Expected: 4 mp4 + 4 jpg in `public/video/`, each mp4 ideally < 5 MB.
```bash
chmod +x scripts/prep-video.sh && ./scripts/prep-video.sh
```
- [ ] **Step 4:** Verify metadata stripped. Expected: no `GPS*`, `Make`, `CreateDate` (creator-identifying) fields.
```bash
exiftool public/video/hero-h-dark.mp4 | grep -iE "gps|make|model|serial|creator|software" || echo "clean"
```
- [ ] **Step 5:** Commit (videos go through LFS).
```bash
git add scripts/prep-video.sh public/video && git commit -m "Add optimized hero videos and posters via LFS"
git lfs ls-files   # expected: the 4 mp4 listed
```

---

## Task group B — Design tokens & glass system (foundation for everything)

### Task B1: Extend tokens to match prototype
**Files:** Modify `src/styles/tokens.css`
Reference: `dreamy.jsx:9–37` (`--d-*` vars), `:48–62` (motion).
- [ ] **Step 1:** Add prototype-aligned variables under `:root` (keep existing names; add new). Light values:
```css
  /* glass + surfaces (from dreamy.jsx :14-24) */
  --c-bg2: #e7ecfa;
  --c-ink-soft: rgba(52, 54, 63, 0.7);
  --c-ink-faint: rgba(52, 54, 63, 0.45);
  --c-glass: rgba(255, 255, 255, 0.5);
  --c-glass-border: rgba(255, 255, 255, 0.7);
  --shadow-glass: 0 1px 0 rgba(255,255,255,.8) inset, 0 18px 50px -12px rgba(80,100,180,.22);
  --accent-grad: linear-gradient(135deg, var(--c-accent) 0%, oklch(60% .2 280) 100%);
```
- [ ] **Step 2:** Mirror dark overrides under `:root[data-theme='dark']` (from `dreamy.jsx:26-34`):
```css
  --c-bg2: #14172a;
  --c-ink-soft: rgba(240,242,252,.7);
  --c-ink-faint: rgba(240,242,252,.45);
  --c-glass: rgba(255,255,255,.06);
  --c-glass-border: rgba(255,255,255,.12);
  --shadow-glass: 0 1px 0 rgba(255,255,255,.08) inset, 0 18px 50px -12px rgba(0,0,0,.5);
```
- [ ] **Step 3:** Retune motion durations for the prototype feel: `--motion-splash-duration: 900ms;` and add `--ease-soft: cubic-bezier(.2,.8,.2,1);`.
- [ ] **Step 4:** Verify build still green.
```bash
npm run build
```
- [ ] **Step 5:** Commit.
```bash
git add src/styles/tokens.css && git commit -m "Extend design tokens with prototype glass and motion values"
```

### Task B2: Add reusable glass + button utility classes
**Files:** Modify `src/styles/global.css`
Reference: `dreamy.jsx:204–256` (`.btn`, `.btn-primary`, `.btn-glass`, `.icon-btn`, `.glass-card`, `.bubble`).
- [ ] **Step 1:** Port `.glass-card`, `.btn`, `.btn-primary`, `.btn-glass`, `.icon-btn`, `.bubble`, `.bubble.active`, `.glass-input`, `.eyebrow`, `.sec-title` (+`.sec-title .it`) classes verbatim from the cited lines, swapping `--d-*` for our token names (`--d-ink`→`--c-ink`, `--d-accent`→`--c-accent`, `--d-glass`→`--c-glass`, etc.). `.btn-primary:hover` MUST keep `background: var(--c-accent); color:#fff; transform: translateY(-2px); box-shadow: 0 12px 30px -8px var(--c-accent);` (this is feedback #19). `.bubble.active` MUST use `background: var(--accent-grad); color:#fff;` (feedback #18).
- [ ] **Step 2:** Verify build + lint.
```bash
npm run build && npm run lint
```
- [ ] **Step 3:** Commit.
```bash
git add src/styles/global.css && git commit -m "Add prototype glass card, button and bubble styles"
```

---

## Task group C — Navigation: glass-pill nav + mega-menu (#2, #4, #5)

### Task C1: Add i18n keys for nav/mega
**Files:** Modify `src/i18n/en.json`, `src/i18n/es.json`
- [ ] **Step 1:** Ensure `nav.home/design/art/contact` exist (note: prototype label for Artwork is **"Artwork"** EN / **"Arte"** ES — `shared.jsx:6,65`). Add category `blurb` strings used by the mega-menu; reuse existing `categories/*.json` `blurb` (preferred — no new i18n keys needed; mega reads the collection). Confirm the 6 design + 3 artwork category JSONs have `blurb.en`/`blurb.es`.
- [ ] **Step 2:** Verify parity guard passes.
```bash
npm run build   # parity guard throws on missing key
```
- [ ] **Step 3:** Commit.
```bash
git add src/i18n && git commit -m "Align nav labels with prototype"
```

### Task C2: Rewrite Header as floating glass-pill nav
**Files:** Rewrite `src/components/layout/Header.astro`
Reference: `dreamy.jsx:40–65` (`.nav-bar`, `.logo`, `.nav-center`, `.nav-link`, `.nav-link.active`, `.nav-right`), `:904–931` (markup), `:933–967` (lang/theme toggles).
- [ ] **Step 1:** Replace the bordered flex header with: fixed `.nav-bar` (3-col grid: logo / centered nav pill / controls), `backdrop-filter: blur(14px)`, gradient fade background. Logo = "Carolina" (Fraunces italic) + "Rivera" (Montserrat 200, uppercase, letter-spacing .15em) + accent `.dot`. Center nav = glass pill with 4 `.nav-link` buttons (Home / Design ▾ / Artwork ▾ / Contact); Design & Artwork carry a `▾` and `data-mega="design|artwork"`. Active link gets `.active` (ink bg) based on current path. Keep the existing `LangToggle`/`ThemeToggle` islands but restyle their wrappers to the prototype's segmented glass pills (`dreamy.jsx:934–966`).
- [ ] **Step 2:** Design/Artwork links still navigate to `/#design` / `/#artwork` on click for no-JS; the mega is a hover/focus enhancement (Task C3). Submenu category links point to `/design/<slug>/` etc. (existing routes).
- [ ] **Step 3:** Verify build; visually confirm nav renders as a centered glass pill over the hero.
```bash
npm run build
```
- [ ] **Step 4:** Commit.
```bash
git add src/components/layout/Header.astro src/components/layout/LangToggle.astro src/components/layout/ThemeToggle.astro && git commit -m "Rebuild header as floating glass-pill nav"
```

### Task C3: Full-width mega-menu (fixes #4 unclickable, #5 poor layout)
**Files:** Modify `src/components/layout/Header.astro` (mega markup), create `src/scripts/mega-menu.ts`, modify `src/styles/global.css` (`.mega*`)
Reference: `dreamy.jsx:67–87` (`.mega`, `.mega-grid`, `.mega-item`, `.mega-num`, `.mega-label`, `.mega-blurb`), `:971–984` (markup).
- [ ] **Step 1:** Render two hidden `.mega` panels (design, artwork) in the header, each a full-width fixed panel at `top:70px` (NO margin gap — this is what fixes the #4 hover dead-zone). Each contains `.mega-grid` (3-col), one `.mega-item` per category built from the `categories` collection: `<span class="mega-num">01</span>`, `<span class="mega-label"><span class="num">01</span>{label}</span>`, `<span class="mega-blurb">{blurb}</span>`. Each item is an `<a href="/design/<slug>/">` (fully clickable — fixes #4).
- [ ] **Step 2:** Write `src/scripts/mega-menu.ts`:
```ts
export const initMegaMenu = (): void => {
  if (typeof document === 'undefined') return;
  const triggers = document.querySelectorAll<HTMLElement>('[data-mega]');
  const panels = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-mega-panel]').forEach((p) => {
    panels.set(p.dataset.megaPanel!, p);
  });
  let openKey: string | null = null;
  const open = (key: string | null) => {
    openKey = key;
    panels.forEach((panel, k) => panel.toggleAttribute('data-open', k === key));
    triggers.forEach((t) => t.setAttribute('aria-expanded', String(t.dataset.mega === key)));
  };
  triggers.forEach((t) => {
    const key = t.dataset.mega!;
    t.addEventListener('mouseenter', () => open(key));
    t.addEventListener('focus', () => open(key));
  });
  panels.forEach((panel) => {
    panel.addEventListener('mouseleave', () => open(null));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openKey) open(null); });
  // Close when focus/hover leaves the whole header region
  const header = document.querySelector('.nav-bar');
  header?.addEventListener('mouseleave', () => open(null));
};
```
CSS: `.mega { display:none; } .mega[data-open] { display:block; }` plus the ported `.mega*` rules. Mega panel and triggers wired with `aria-controls`/`aria-expanded`; trigger buttons have `role` left as links/buttons.
- [ ] **Step 3:** Hydrate via `<script>import { initMegaMenu } from '../../scripts/mega-menu'; initMegaMenu();</script>` in Header.
- [ ] **Step 4:** Verify: build; manually confirm hovering "Design" opens a 3-col grid with `01–06` numbers + italic labels + blurbs, items are clickable and navigate, and moving the cursor down into the panel does NOT close it (the #4 fix).
```bash
npm run build
```
- [ ] **Step 5:** Commit.
```bash
git add src/components/layout/Header.astro src/scripts/mega-menu.ts src/styles/global.css && git commit -m "Add full-width mega-menu with numbered category grid"
```

---

## Task group D — Hero video (#1, #19)

### Task D1: Rewrite Hero with background video + two CTAs
**Files:** Rewrite `src/components/sections/Hero.astro`; modify `src/i18n/{en,es}.json`
Reference: `dreamy.jsx:94–122` (`.hero-stage`, sparkles, caustic), `:173–202` (entrance keyframes + title), `:390–457` (markup, two CTAs, scroll hint), `shared.jsx:20–30` (copy: `cta1:"See the work"`, `cta2:"Say hello"`, `since`, `scrollHint`).
- [ ] **Step 1:** Add i18n keys: `hero.cta1`="See the work"/"Ver el trabajo", `hero.cta2`="Say hello"/"Saludar", `hero.since`="Independent practice — since 2019"/"Práctica independiente — desde 2019", `hero.scrollHint`="scroll"/"desliza", `hero.location`="Bogotá · COL". Keep existing `home.name.first/last`, `home.tagline`.
- [ ] **Step 2:** Rewrite markup: `.hero-stage` (min-height 100vh) containing a `<video class="hero-video" autoplay muted loop playsinline preload="metadata" poster=...>` with four `<source>` candidates and a `data-hero-video` hook; over it the content block: top 3-col row (since / eyebrow tagline / location), `<h1 class="hero-title">` with `.hero-first` ("Carolina") and `.hero-last` ("Rivera", gradient), lede, two buttons (`.btn-primary` "See the work →" linking `/#design`; `.btn-glass` "Say hello" linking `/#contact`), and a scroll hint. The `.hero-last` gradient is feedback #3 — use `dreamy.jsx:198` exact: `linear-gradient(180deg, var(--c-accent) 0%, oklch(58% .22 280) 60%, oklch(48% .25 290) 100%)`.
- [ ] **Step 3:** Default `<source>` = horizontal, theme chosen at runtime by `hero-video.ts`. Provide poster `="/video/hero-h-dark-poster.jpg"` (script swaps per theme). Wrap CTAs/title in entrance animation classes `.hero-letters`/`.hero-rivera-wrap` (port keyframes `heroIn`/`riveraIn` from `dreamy.jsx:173–187` into global.css). This is feedback #1's entrance.
- [ ] **Step 4:** Verify build.
```bash
npm run build
```
- [ ] **Step 5:** Commit.
```bash
git add src/components/sections/Hero.astro src/i18n && git commit -m "Replace SVG jellyfish hero with background video and dual CTA"
```

### Task D2: hero-video.ts — theme/orientation source, reduced-motion, parallax
**Files:** Create `src/scripts/hero-video.ts`; modify `Hero.astro` to hydrate it; modify `src/styles/global.css` (`.hero-video`, fade/parallax vars)
- [ ] **Step 1:** Write the script: pick source by `matchMedia('(prefers-color-scheme: dark)')` OR the `data-theme` attribute, and orientation by `matchMedia('(max-width: 768px)')` → vertical. Set `<video src>` accordingly and matching poster. On `prefers-reduced-motion: reduce`, do NOT autoplay — call `video.pause()` and keep the poster (a11y). Add a passive scroll listener mapping `scrollY` to a `--hero-fade` (opacity, `max(0, 1 - scrollY/700)`) and a subtle `--hero-shift` translate on the title (`scrollY * -0.06`), matching `dreamy.jsx:391–394`.
```ts
const SRC = {
  h: { dark: '/video/hero-h-dark.mp4', light: '/video/hero-h-light.mp4' },
  v: { dark: '/video/hero-v-dark.mp4', light: '/video/hero-v-light.mp4' },
};
export const initHeroVideo = (): void => {
  if (typeof document === 'undefined') return;
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const stage = document.querySelector<HTMLElement>('.hero-stage');
  if (!video || !stage) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pick = () => {
    const dark = document.documentElement.dataset.theme === 'dark'
      || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const orient = window.matchMedia('(max-width: 768px)').matches ? 'v' : 'h';
    const theme = dark ? 'dark' : 'light';
    const next = SRC[orient][theme];
    const base = next.replace('.mp4', '');
    if (!video.src.endsWith(next)) {
      video.src = next;
      video.poster = `${base}-poster.jpg`;
      if (!reduce) video.play().catch(() => {});
    }
  };
  pick();
  window.matchMedia('(max-width: 768px)').addEventListener('change', pick);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', pick);
  document.addEventListener('themechange', pick); // theme.ts should dispatch this on toggle
  if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      stage.style.setProperty('--hero-fade', String(Math.max(0, 1 - y / 700)));
      stage.style.setProperty('--hero-shift', `${y * -0.06}px`);
      ticking = false;
    });
  }, { passive: true });
};
```
- [ ] **Step 2:** In `src/scripts/theme.ts`, after applying a theme, `document.dispatchEvent(new Event('themechange'))` (so the video swaps light/dark instantly). Verify theme.ts current API and add the dispatch.
- [ ] **Step 3:** CSS: `.hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:var(--hero-fade,1);}` and apply `transform: translateY(var(--hero-shift,0))` to `.hero-title`.
- [ ] **Step 4:** Verify build; manually confirm: video autoplays muted/looping, swaps on theme toggle, mobile width shows vertical cut, reduced-motion shows the poster paused.
```bash
npm run build
```
- [ ] **Step 5:** Commit.
```bash
git add src/scripts/hero-video.ts src/scripts/theme.ts src/components/sections/Hero.astro src/styles/global.css && git commit -m "Drive hero video by theme, orientation and reduced-motion"
```

---

## Task group E — Portfolio sections (#8, #9, #10, #16, #17, #18, #20, #21)

### Task E1: Section intro banner + left-align + explore button
**Files:** Modify `src/components/sections/PortfolioSection.astro`; modify `src/i18n/{en,es}.json`
Reference: `dreamy.jsx:584–611` (eyebrow + `.sec-title` banner + blurb + bubbles, all left-aligned with `padding: 0 6vw`), `:633–637` (explore button), `shared.jsx:32–39` (titles), `:62,120` (explore label).
- [ ] **Step 1:** Add i18n: `design.title1`="Things made", `design.title2`="for the screen and the page"; `art.title1`="Things made", `art.title2`="by hand"; ES from `shared.jsx:90–96`. `explore`="Explore the case"/"Explorar el caso". Eyebrows already exist (`design.eyebrow`/`artwork.eyebrow`).
- [ ] **Step 2:** Insert, before the bubble row, a banner: eyebrow + `<h2 class="sec-title">{title1} <span class="it">{title2}</span></h2>` + the active category's blurb `<p>`. Ensure the section content container is **left-aligned** (`padding: 0 6vw; text-align:left`) — feedback #9, #17.
- [ ] **Step 3:** After the meta strip, add a centered explore button: `<a class="btn btn-glass" data-explore href="/design/<activeCat>/">{explore} — {label} →</a>` whose href updates with the active category (set initial server-side; `bubble-selector.ts` updates it on change — Task E4). Feedback #11.
- [ ] **Step 4:** Verify build.
```bash
npm run build
```
- [ ] **Step 5:** Commit.
```bash
git add src/components/sections/PortfolioSection.astro src/i18n && git commit -m "Add section intro banner, left alignment and explore button"
```

### Task E2: Showcase card — glass frame, title-inside gradient, cursor label (#21, #20, #10)
**Files:** Rewrite `src/components/sections/Showcase.astro`; modify `src/styles/global.css`
Reference: `dreamy.jsx:258–282` (`.showcase-track/-card/-frame/-screen/-meta/-tag`), `:494–547` (card markup, title-inside gradient overlay `:513–525`, glass arrows + dots `:532–547`), `:343–374` (Placeholder faux-browser).
- [ ] **Step 1:** Port CSS: `.showcase-track` (flex, gap 24px, `scroll-snap-type:x mandatory`, `padding: 30px 6vw`, hidden scrollbar, `cursor:grab`), `.showcase-card` (`flex:0 0 clamp(360px,50cqw,600px); scroll-snap-align:center; aspect-ratio:16/11`), `.showcase-frame` (glass, radius 26px, hover `translateY(-6px)`), `.showcase-screen` (inset cover), `.showcase-meta` (absolute bottom). Update `Placeholder.astro` to the faux-browser look from `:343–374` if not already.
- [ ] **Step 2:** Rebuild card markup so the **title sits inside the frame** over a gradient overlay (feedback #21): inside `.showcase-meta`, a div with `background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 100%)` containing `.d-display` italic title (white, 22px, text-shadow) and a `client · role` line. Add `.showcase-tag` (category) top-left. The card `<a>` carries `data-cursor="media" data-cursor-label={categoryLabel}` (feedback #20). The card `href` points to the **detail page** `/design/<cat>/<slug>/` (built in group F) — fixes #7.
- [ ] **Step 3:** Replace the `‹/›` arrows with the prototype's glass `←/→` buttons + a dot row (`data-dot`, active dot 28px pill) — feedback #10. Mark nav buttons/dots `data-no-splash data-cursor="link"`.
- [ ] **Step 4:** Verify build + lint.
```bash
npm run build && npm run lint
```
- [ ] **Step 5:** Commit.
```bash
git add src/components/sections/Showcase.astro src/components/visual/Placeholder.astro src/styles/global.css && git commit -m "Rebuild showcase card with in-frame gradient title and dot nav"
```

### Task E3: Carousel logic — first card active + centering + dots (#8, #16)
**Files:** Modify `src/scripts/carousel.ts`
Reference: `dreamy.jsx:469–492` (center-distance active detection + `scrollTo` centering math).
- [ ] **Step 1:** Replace IntersectionObserver active detection with the prototype's center-distance approach: on scroll, active = card whose center is closest to `track.scrollLeft + clientWidth/2`. On hydration, **explicitly scroll card 0 to center** so the first project is the primary selection at rest (fixes #8 "lands on 2nd" and #16 "shifted right"):
```ts
const centerOn = (track: HTMLElement, i: number) => {
  const cards = [...track.querySelectorAll<HTMLElement>('.showcase-card')];
  const c = cards[i]; if (!c) return;
  const left = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
  track.scrollTo({ left, behavior: 'auto' });
};
```
Call `centerOn(track, 0)` after wiring listeners, and on `bubble:change` reset to 0.
- [ ] **Step 2:** Arrow buttons call `centerOn(track, active±1)` with `behavior:'smooth'`; dots call `centerOn(track, i)`. Dispatch `carousel:active {index, slug}` on active change; update active dot width.
- [ ] **Step 3:** Verify build; manually confirm first card is centered/active on load and the meta strip + active dot reflect card 0.
```bash
npm run build
```
- [ ] **Step 4:** Commit.
```bash
git add src/scripts/carousel.ts && git commit -m "Center first project on load and sync dots with active card"
```

### Task E4: Bubble selector — active gradient + explore href + reset (#18)
**Files:** Modify `src/scripts/bubble-selector.ts`
- [ ] **Step 1:** On bubble click: set the clicked `.bubble.active` (CSS gradient from B2 = feedback #18), clear others, filter showcase wrappers, update eyebrow + blurb text, update the `[data-explore]` button href + label to the new category, and dispatch `bubble:change` (carousel resets to card 0 per E3).
- [ ] **Step 2:** Verify build.
```bash
npm run build
```
- [ ] **Step 3:** Commit.
```bash
git add src/scripts/bubble-selector.ts && git commit -m "Style active bubble and route explore button per category"
```

---

## Task group F — Subpages + per-project detail pages (#7, #12)

### Task F1: Add `overview` field to schema + placeholder copy
**Files:** Modify `src/content.config.ts`; modify project JSONs (script)
- [ ] **Step 1:** Add `overview: langString.optional()` to the `projects` schema (after `subtitle`).
- [ ] **Step 2:** Add a placeholder bilingual `overview` to each project JSON via a one-off node script (reuse the existing seed approach) — 1–2 sentences derived from `subtitle`. Keep `gallery: []`.
- [ ] **Step 3:** Verify build (schema validates).
```bash
npm run build
```
- [ ] **Step 4:** Commit.
```bash
git add src/content.config.ts src/content/projects && git commit -m "Add optional overview field to project schema"
```

### Task F2: Gallery carousel component (placeholder-aware)
**Files:** Create `src/components/visual/Gallery.astro`; modify `src/scripts/carousel.ts` (reuse) or add `src/scripts/gallery.ts`
- [ ] **Step 1:** Build a horizontal scroll-snap gallery that renders `project.gallery` images when present, else N placeholder slides (`Placeholder.astro` with the project hue/glyph). Reuse `initCarousel` plumbing (arrows + dots). Each slide is `data-cursor="media"`.
- [ ] **Step 2:** Verify build.
```bash
npm run build
```
- [ ] **Step 3:** Commit.
```bash
git add src/components/visual/Gallery.astro src/scripts && git commit -m "Add reusable project gallery carousel"
```

### Task F3: ProjectDetail template
**Files:** Create `src/components/sections/ProjectDetail.astro`; add i18n labels
Reference aesthetic: subpage hero (`dreamy.jsx:663–682`), meta strip (`:616–631`), glass cards.
- [ ] **Step 1:** Add i18n: `detail.back`="Back to {category}"/"Volver a {category}", `detail.overview`="Overview"/"Resumen", `detail.next`="Next project"/"Siguiente", `detail.prev`="Previous project"/"Anterior". Reuse `meta.*`.
- [ ] **Step 2:** Build the template from props `{ project, category, prev, next, lang }`: back link → category subpage; category `.showcase-tag`; big Fraunces-italic title; `subtitle` lede; meta strip (Studio/Role/Sectors/Year from project); `overview` paragraph (if present); `<Gallery>`; prev/next project nav (glass buttons linking sibling projects in the same category). Left-aligned, glass aesthetic.
- [ ] **Step 3:** Verify build.
```bash
npm run build
```
- [ ] **Step 4:** Commit.
```bash
git add src/components/sections/ProjectDetail.astro src/i18n && git commit -m "Add reusable project detail template"
```

### Task F4: Detail routes (EN + ES, design + artwork)
**Files:** Create `src/pages/design/[category]/[project].astro`, `src/pages/artwork/[category]/[project].astro`, and `src/pages/es/...` mirrors
- [ ] **Step 1:** `getStaticPaths()` iterates the `projects` collection filtered by `kind`, params `{ category, project: slug }`, computing `prev`/`next` within the category. Render `<BaseLayout><ProjectDetail .../></BaseLayout>`. ES mirrors set `lang="es"` and localize hrefs via `localizedHref`.
- [ ] **Step 2:** Verify all routes generate.
```bash
npm run build && find dist -path "*design*" -name "index.html" | head
```
- [ ] **Step 3:** Commit.
```bash
git add src/pages && git commit -m "Generate per-project detail routes for all categories and locales"
```

### Task F5: Subpage grid fidelity + link cards to detail (#12)
**Files:** Modify `src/components/sections/SubpageGrid.astro`; modify `src/styles/global.css`
Reference: `dreamy.jsx:284–297` (`.sub-grid` 4-col, `.sub-card` tilt nth-child, `.sub-tag`, `.ph-glyph`), `:646–740` (markup: centered title + rules, 8-card grid, pagination `1 · · · 4`, sister bubbles, glass footer strip). Ref image `Ref Subpage.jpeg`.
- [ ] **Step 1:** Port the 4-col tilted grid (`nth-child(2n) rotate(.8deg)`, `nth-child(3n) rotate(-.6deg)`, hover flattens) replacing the current drag-row layout; each `.sub-card` is an `<a href="/<kind>/<cat>/<slug>/">` (feedback #12 — cards now route). Keep the build-time tilt; keep drag-to-pan optional but ensure links work (click vs drag threshold).
- [ ] **Step 2:** Match heading (centered Fraunces italic + two rules), pagination dots, sister-category bubbles (active = gradient), and glass footer email strip per `Ref Subpage.jpeg`.
- [ ] **Step 3:** Verify build.
```bash
npm run build
```
- [ ] **Step 4:** Commit.
```bash
git add src/components/sections/SubpageGrid.astro src/styles/global.css && git commit -m "Restore subpage grid fidelity and link cards to project pages"
```

---

## Task group G — Contact (#13)

### Task G1: Rewrite Contact to match Ref Contact
**Files:** Rewrite `src/components/sections/Contact.astro`; modify `src/i18n/{en,es}.json`; modify `src/styles/global.css`
Reference: `dreamy.jsx:748–860` (full layout), `shared.jsx:41–59,99–117` (copy), `Ref Contact.jpeg`.
- [ ] **Step 1:** Add/confirm i18n: `contact.title`="Let's make", `contact.titleIt`="something" (ES "Hagamos"/"algo"); `contact.l1/l2/l3` (3 weighted lines); `contact.based`="Based in", `contact.basedCity`="Bogotá, COL", `contact.reply`="Reply within 48h"; form `name/msg/submit/sent/copy/copied`; `contact.send`="Send a message".
- [ ] **Step 2:** Markup: eyebrow "—Contact"; 2-col grid (`1.2fr .8fr`). Left: big Fraunces-italic title with gradient `.it` accent (#3-style gradient on "something"); three lines (22px/500, 17px/soft, 14px italic/faint); glass email card with Copy button + Based/Reply grid. Right: glass `.glass-card` form ("Send a message", Name, Email, Tell me about it, Send) + a row of **four 60px glass social bubbles** (Behance Bē / Instagram ◎ / LinkedIn in / WhatsApp ☎) — feedback #13 "make social icons more visible". Keep mailto/no-op submit and the copy-to-clipboard behavior.
- [ ] **Step 3:** Port `.glass-input` styles. Responsive: stack to 1 col under 768px.
- [ ] **Step 4:** Verify build + lint + parity.
```bash
npm run build && npm run lint
```
- [ ] **Step 5:** Commit.
```bash
git add src/components/sections/Contact.astro src/i18n src/styles/global.css && git commit -m "Rebuild contact section per Ref Contact sketch"
```

---

## Task group H — Motion polish (#14, #15, #20)

### Task H1: Paint splash — slower, irregular, blob, less 3D (#14)
**Files:** Rewrite `src/scripts/splash.ts`; modify `src/styles/global.css` (`.splash-drop`, `@keyframes splash-fly`), `tokens.css` already set to 900ms
Reference: `shared.jsx:281–318` (random dx/dy ±140 with -30 bias, size 4–12, random color, blob `border-radius`), `index.html:29–32` (keyframe).
- [ ] **Step 1:** Replace the uniform radial burst with **random scatter**: 8 drops, `dx=(rand-.5)*140`, `dy=(rand-.5)*140-30`, `size=4+rand*8`, random color from palette, randomly choose `border-radius: 50%` or blob `30% 70% 70% 30% / 30% 30% 70% 70%`. Skip splash when target matches `input,textarea,select,[data-no-splash]`.
- [ ] **Step 2:** Soften the "3D" feel: keyframe scales `.4→1.2` but reduce rotation to ≤90° (or remove), extend to 900ms (`--motion-splash-duration`), and add a slight blur (`filter: blur(.3px)`) so drops read like paint, not beads. Remove the `radial-gradient` "glossy" look in favor of flat fill (less 3D).
- [ ] **Step 3:** Verify build; manually confirm clicks scatter irregular paint blobs that read slower and flatter.
```bash
npm run build && npm run lint
```
- [ ] **Step 4:** Commit.
```bash
git add src/scripts/splash.ts src/styles/global.css && git commit -m "Make paint splash slower and irregular like real paint"
```

### Task H2: Marquee — big italic, seamless loop (#15)
**Files:** Modify `src/components/visual/Marquee.astro`, `src/scripts/marquee.ts`, `src/styles/global.css`
Reference: `dreamy.jsx:310–317` (`.marquee` big Fraunces italic), `shared.jsx:361–379` (4-copy row, `marquee-x` 0→-25%), `index.html:25–28`.
- [ ] **Step 1:** Style `.marquee` as big Fraunces italic 300, `clamp(40px,7cqw,110px)`, top/bottom hairline borders, glass bg. Items + accent separator inline.
- [ ] **Step 2:** Fix the seam (#15): instead of cloning once → -50%, render/clone the track so the animation translates a whole-number fraction with ≥2 identical copies and no trailing gap. Simplest faithful fix: emit the items twice in the track and animate `0 → -50%` ensuring the **last item also has a trailing separator+gap equal to inter-item gap** (the current seam is the missing trailing gap). Verify by eye that the loop point is invisible.
- [ ] **Step 3:** Update home marquee content/speed to match prototype (`shared.jsx:31` items; second marquee `["Studio","Carolina Rivera","Bogotá",...]` sep "·" speed 48 — `dreamy.jsx:996–998`).
- [ ] **Step 4:** Verify build; watch one full loop for a seam.
```bash
npm run build
```
- [ ] **Step 5:** Commit.
```bash
git add src/components/visual/Marquee.astro src/scripts/marquee.ts src/styles/global.css && git commit -m "Restyle marquee as italic display and remove loop seam"
```

### Task H3: Cursor label on project hover (#20)
**Files:** Modify `src/scripts/cursor.ts`; modify `src/styles/global.css` (`#cursor-ring` label)
Reference: `shared.jsx:209–278` (label rendered inside ring when `hover==="media"`).
- [ ] **Step 1:** On `pointermove`, read `data-cursor` and `data-cursor-label` from the closest `[data-cursor]`. When mode is `media` and a label exists, render the label text centered inside the ring (uppercase, 11px, white, Montserrat) and ensure the ring is the 96px filled accent disk. Clear label otherwise.
- [ ] **Step 2:** Verify build; hover a project card → category label appears in the cursor ring.
```bash
npm run build && npm run lint
```
- [ ] **Step 3:** Commit.
```bash
git add src/scripts/cursor.ts src/styles/global.css && git commit -m "Show project category label inside cursor on hover"
```

---

## Task group I — Responsive pass (#6)

### Task I1: Responsive breakpoints across sections
**Files:** Modify `src/styles/global.css` (media queries), verify `Hero`, `Header`, `PortfolioSection`, `Showcase`, `SubpageGrid`, `ProjectDetail`, `Contact`
- [ ] **Step 1:** Define breakpoints (e.g. `768px` tablet, `560px` phone). Per section: nav pill collapses gracefully (consider hiding center pill text or wrapping; mega becomes a stacked list under 768px); hero uses vertical video + smaller title clamps; portfolio `padding: 0 5vw`, sec-title clamps down, bubbles wrap, meta strip → 2 cols; showcase card `flex-basis` → `clamp(260px, 86vw, 420px)`; sub-grid → 2 cols then 1; contact → 1 col; marquee font clamps. Confirm no horizontal overflow at 360px width.
- [ ] **Step 2:** Verify build; check at 360 / 768 / 1280 widths that layout holds and the mobile (vertical) hero video loads.
```bash
npm run build
```
- [ ] **Step 3:** Commit.
```bash
git add src/styles/global.css src/components && git commit -m "Apply responsive layout across all sections"
```

---

## Task group J — Cleanup, verification, integration

### Task J1: Retire unused jellyfish hero assets
**Files:** Possibly delete `src/components/visual/Jellyfish.astro`, `Sparkles.astro`, `src/scripts/jellyfish-drift.ts` (if no longer referenced)
- [ ] **Step 1:** Grep for references; if none remain after the video hero, delete the files (or keep `Sparkles` if reused over the video). Remove dead imports.
```bash
grep -rn "Jellyfish\|jellyfish-drift\|Sparkles" src/ || echo "none"
```
- [ ] **Step 2:** Verify build + lint + typecheck.
```bash
npm run build && npm run lint && npm run typecheck
```
- [ ] **Step 3:** Commit.
```bash
git add -A && git commit -m "Remove unused SVG jellyfish hero assets"
```

### Task J2: Full verification against feedback
- [ ] **Step 1:** Run the full gate.
```bash
npm ci && npm run lint && npm run typecheck && npm run build
```
- [ ] **Step 2:** Walk `feedback.pdf` #1–#21 against the running site (`npm run dev -- --host`) and tick each. Record results in the README smoke checklist. Confirm specifically: #4 mega stays open crossing the gap; #7 project click opens a detail page (not top); #8 first project is primary; #12 mega/explore/cards/sisters all route; #14 splash reads like paint; #15 no marquee seam; #20 label in cursor; #21 title inside card.
- [ ] **Step 3:** Reduced-motion + touch smoke: cursor off on touch; video paused/poster on reduced-motion; splash/marquee disabled on reduced-motion.
- [ ] **Step 4:** Commit README update.
```bash
git add README.md && git commit -m "Document Phase 2 feedback resolutions and smoke checklist"
```

### Task J3: Integrate
- [ ] **Step 1:** Push branch and open PR targeting `main` (merge, never rebase). No co-author trailer.
```bash
git push -u origin feature/phase-2-design-fidelity
gh pr create --base main --title "Phase 2 — design fidelity, video hero, project detail pages" --body "Resolves all notes in feedback.pdf (#1–#21). See docs/superpowers/plans/2026-05-21-phase-2-design-fidelity.md."
```
- [ ] **Step 2:** Use superpowers:requesting-code-review before merge.

---

## Feedback → task traceability

| # | Note | Task |
|---|---|---|
| 1 | Change home animation (→ video) | D1, D2 |
| 2 | Menu more harmonious | C2 |
| 3 | "Rivera" gradient | D1 (Step 2) |
| 4 | Submenu unclickable | C3 |
| 5 | Submenu poorly laid out | C3 |
| 6 | Responsive | I1 |
| 7 | Project click returns to top | E2, F3, F4 |
| 8 | Category lands on 2nd project | E3 |
| 9 | Intro banner before projects | E1 |
| 10 | Circular nav + dots | E2 |
| 11 | Explore section button | E1, E4 |
| 12 | Nothing routes to subpages | C3, E1, F4, F5 |
| 13 | Contact titles + social icons | G1 |
| 14 | Paint splash slower/irregular | H1 |
| 15 | Marquee continuity seam | H2 |
| 16 | Categories shifted right | E3 |
| 17 | Left-justify like reference | E1 |
| 18 | Selected-bubble animation | B2, E4 |
| 19 | Hero CTA hover animation | B2, D1 |
| 20 | Name in cursor on hover | E2, H3 |
| 21 | Card title inside w/ gradient | E2 |

## Self-review notes
- Spec coverage: all 21 feedback items mapped above; plus video pipeline (A), detail pages (F), responsive (I).
- Type consistency: `centerOn(track, i)` used in E3; `bubble:change`/`carousel:active` event names consistent across carousel.ts/bubble-selector.ts; `data-hero-video`, `data-mega`, `data-mega-panel`, `data-explore`, `data-cursor-label` hooks consistent across tasks.
- Risk: video file sizes after transcode — if any cut still >5 MB, re-run with `-crf 28` or lower max width; verify in A3 Step 3.
