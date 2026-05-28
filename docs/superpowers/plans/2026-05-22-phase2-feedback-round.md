# Phase 2 Feedback Round (Carolina, 20 items) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply all 20 feedback items from `feedback.pdf` (Carolina's review) to the Astro portfolio — nav/menu behavior, carousel polish, marquee restraint, project pages, contact icons, hero overlay, and a mobile reorganization.

**Architecture:** Astro 6 static site, plain CSS with design tokens (`src/styles/`), TypeScript hydration scripts (`src/scripts/`). Most changes are CSS + small script edits. No unit-test framework exists; this is a visual frontend project, so **verification = `npm run typecheck && npm run lint && npm run build` all clean, plus a manual visual check in `npm run dev`** (and a real-browser screenshot for the visually-ambiguous items 6, 7, 19). All work lands on one branch `feature/phase-2-feedback-round` with one commit per task and a single PR at the end.

**Tech Stack:** Astro 6.3.1, TypeScript, plain CSS (`@import` tokens/reset), ESLint (airbnb-base, `--max-warnings=0`), `astro check`.

> **Commit convention (Jericho + project memory):** a `commit-msg` hook enforces messages starting with a **capitalized infinitive verb** (`Add`, `Fix`, `Update`, `Remove`, `Restyle`, `Refine`…) — **no** `feat:`/`fix:` prefixes. The `feat(...)`/`fix(...)` messages written in the task steps below are illustrative only; rewrite each to the Jericho form. **Omit** the `Co-Authored-By` trailer — this is a design-build round, not scaffolding. TypeScript edits must keep explicit return types, single quotes, semicolons, and labeled import groups (`// packages`, `// utils`, etc.).

---

## Source-of-truth note (READ FIRST)

- The original prototype is `docs/design-reference/dreamy.jsx`. Most items restore fidelity to it.
- **Exception — items 9 & 10 (marquee):** the current marquee already matches `dreamy.jsx` (huge Fraunces italic, `clamp(40px,7cqw,110px)`). Carolina's "original" reference in the PDF is the *opposite* — a small, sans-serif band. For the marquee, **follow the PDF screenshots, not `dreamy.jsx`.**
- The big translucent circle showing "DRAWING"/"PHOTOGRAPHY" in the item 6/7 screenshots is **the custom cursor ring** (`src/scripts/cursor.ts`, `#cursor-ring` in `media` mode), not a card element. Item 7 is about that cursor label.

## Nav behavior decision (items 1 + 2)

These two interact, so the agreed behavior is:
- **Hover** Design/Artwork → mega opens; a 180 ms close delay + panel-hover cancel makes it reachable (fixes "can't click a sub-category").
- **Click** Design/Artwork **on the home page** → pin the mega open (trigger highlighted) **and** smooth-scroll to that section. A `suppressScrollClose` flag stops the programmatic scroll from closing the just-pinned menu.
- **Click** Design/Artwork **on a non-home page** → no preventDefault; the `/#design` link navigates home normally.
- Pinned mega closes on: manual scroll, `Escape`, click outside header/panel, focus leaving header, or clicking the same trigger again.
- **Home / Contact links and hero CTAs** → smooth-scroll to the on-page section (generic handler, skips `[data-mega]`).

---

## File Structure

| File | Responsibility | Tasks |
|------|----------------|-------|
| `src/scripts/mega-menu.ts` | rewrite: hover-reachable + click-to-pin + close rules + smooth-scroll for Design/Artwork | 1 |
| `src/scripts/smooth-scroll.ts` | **new**: generic same-page anchor smooth scroll (Home/Contact/hero CTAs) | 1 |
| `src/layouts/BaseLayout.astro` | wire `initSmoothScroll()` | 1 |
| `src/scripts/carousel.ts` | force first card featured on load + bubble-change | 2 |
| `src/styles/global.css` | the bulk of CSS edits (carousel, marquee, meta strip, spacing, detail, contact, hero, mobile) | 2,4,5,7,8,10,11,12,13 |
| `src/components/sections/Showcase.astro` | drop in-preview studio label; hide dots when ≤1 item | 2,3 |
| `src/components/visual/Marquee.astro` | (no change; CSS only) | 4 |
| `src/components/sections/PortfolioSection.astro` | meta strip → centered bubble; explore button text | 5,6 |
| `src/scripts/bubble-selector.ts` | drop explore-label update | 6 |
| `src/i18n/en.json`, `src/i18n/es.json` | `explore` → "Explore more" / "Explorar más" | 6 |
| `src/scripts/cursor.ts` | shrink media-mode label so it fits the ring | 7 |
| `src/components/sections/SubpageGrid.astro` | center sister bubbles; data-driven pagination | 8b (item 16,15b) |
| `src/components/sections/ProjectDetail.astro` | plain category label | 9 (item 17) |
| `src/components/visual/Gallery.astro` | larger images | 9 (item 18) |
| `src/components/sections/Contact.astro` | (CSS only) | 10 (item 14) |
| `src/components/layout/Header.astro` | hamburger trigger + mobile menu markup | 11 (item 19) |
| `src/scripts/mobile-nav.ts` | **new**: hamburger open/close | 11 |

---

## Item → Task map

| PDF item | Task |
|---|---|
| 1 pinned/reachable submenu | 1 |
| 2 smooth scroll to category | 1 |
| 3 spacing blurb↔bubbles (artwork) | 6 |
| 4 first card featured | 2 |
| 5 round carousel arrows | 2 |
| 6 rounded preview corners | 2 |
| 7 cursor label not to circle edge | 5 |
| 8 meta strip centered in bubble | 4 |
| 9 marquee size subtle | 3 |
| 10 marquee typography (sans) | 3 |
| 11 "Explore more" button | 7 |
| 12 spacing text lines (design) | 6 |
| 13 omit text inside preview | 2 |
| 14 social icons lighter + white | 8 |
| 15 hide dots when 1 page / `← 1…N →` | 2 (dots) + 9 (subpage) |
| 16 center subcategory content | 9 |
| 17 plain category label on detail | 10 |
| 18 larger project images | 10 |
| 19 mobile reorganization | 11 |
| 20 hero video opacity overlay | 12 |

---

## Task 1: Nav — reachable + pinned mega menu, smooth scroll (items 1, 2)

**Files:**
- Rewrite: `src/scripts/mega-menu.ts`
- Create: `src/scripts/smooth-scroll.ts`
- Modify: `src/layouts/BaseLayout.astro:72-80`
- Modify: `src/styles/global.css` (add `.nav-link.is-open` highlight)

- [ ] **Step 1: Rewrite `src/scripts/mega-menu.ts`** with the full body below.

```ts
export const initMegaMenu = (): void => {
  if (typeof document === 'undefined') return;
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-mega]'));
  const panels = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-mega-panel]').forEach((p) => {
    const key = p.dataset.megaPanel;
    if (key) panels.set(key, p);
  });
  const header = document.querySelector<HTMLElement>('.site-header');

  let openKey: string | null = null;
  let pinned = false;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let suppressScrollClose = false;

  const render = (): void => {
    panels.forEach((panel, k) => {
      if (k === openKey) panel.setAttribute('data-open', '');
      else panel.removeAttribute('data-open');
    });
    triggers.forEach((trigger) => {
      const isOpen = trigger.dataset.mega === openKey;
      trigger.setAttribute('aria-expanded', String(isOpen));
      trigger.classList.toggle('is-open', isOpen);
    });
  };

  const open = (key: string | null, opts: { pin?: boolean } = {}): void => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    openKey = key;
    if (key === null) pinned = false;
    else if (opts.pin) pinned = true;
    render();
  };

  const scheduleClose = (): void => {
    if (pinned) return;
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => open(null), 180);
  };

  const insideChrome = (node: Node | null): boolean => {
    if (!node) return false;
    if (header?.contains(node)) return true;
    return Array.from(panels.values()).some((p) => p.contains(node));
  };

  triggers.forEach((trigger) => {
    const key = trigger.dataset.mega;
    if (!key) return;
    trigger.addEventListener('mouseenter', () => open(key));
    trigger.addEventListener('mouseleave', scheduleClose);
    trigger.addEventListener('focus', () => open(key));
    trigger.addEventListener('click', (e) => {
      const href = trigger.getAttribute('href') ?? '';
      const hash = href.includes('#') ? `#${href.split('#')[1] ?? ''}` : '';
      const target = hash.length > 1 ? document.querySelector(hash) : null;
      if (!target) return; // not on home → allow normal navigation to /#section
      e.preventDefault();
      if (openKey === key && pinned) { open(null); return; }
      open(key, { pin: true });
      suppressScrollClose = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => { suppressScrollClose = false; }, 800);
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener('mouseenter', () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    });
    panel.addEventListener('mouseleave', scheduleClose);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openKey) open(null); });
  document.addEventListener('click', (e) => { if (openKey && !insideChrome(e.target as Node)) open(null); });
  document.addEventListener('focusin', (e) => { if (openKey && !insideChrome(e.target as Node)) open(null); });
  window.addEventListener('scroll', () => {
    if (!openKey || suppressScrollClose) return;
    open(null);
  }, { passive: true });
};
```

- [ ] **Step 2: Create `src/scripts/smooth-scroll.ts`** (generic same-page anchors; skips `[data-mega]` which mega-menu handles).

```ts
export const initSmoothScroll = (): void => {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const anchor = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
    if (!anchor || anchor.hasAttribute('data-mega')) return;
    const href = anchor.getAttribute('href') ?? '';
    const idx = href.indexOf('#');
    if (idx < 0) return;
    const path = href.slice(0, idx);
    const hash = href.slice(idx);
    // only intercept when the hash target exists on the current page
    if (path && !path.endsWith(window.location.pathname)) return;
    if (hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', hash);
  });
};
```

- [ ] **Step 3: Wire it in `src/layouts/BaseLayout.astro`** — edit the body script block (lines 72-80):

```astro
    <script>
      import { initCursor } from '../scripts/cursor';
      import { initSplash } from '../scripts/splash';
      import { initReveal } from '../scripts/reveal';
      import { initSmoothScroll } from '../scripts/smooth-scroll';

      initCursor();
      initSplash('#7A8FF7');
      initReveal();
      initSmoothScroll();
    </script>
```

- [ ] **Step 4: Add the pinned/open highlight in `src/styles/global.css`** after `.nav-link.active` (line ~897):

```css
.nav-link.is-open{ color: var(--c-ink); background: rgba(255,255,255,.5); }
:root[data-theme='dark'] .nav-link.is-open{ background: rgba(255,255,255,.08); }
```

- [ ] **Step 5: Verify** — `npm run typecheck && npm run lint && npm run build`. Then `npm run dev`, on the home page: hover Design → menu opens; move down into the panel → it stays; click a sub-category → navigates. Click Design → page smooth-scrolls to the design section and the menu stays pinned + highlighted; scroll manually → it closes. Click Home/Contact → smooth scroll. On a `/design/branding/` subpage, clicking Design navigates home.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/mega-menu.ts src/scripts/smooth-scroll.ts src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat(nav): reachable + pinned mega menu and smooth-scroll to sections"
```

---

## Task 2: Carousel — round arrows, first card featured, rounded preview, hide single-item dots, drop in-preview label (items 4, 5, 6, 13, 15-dots)

**Files:**
- Modify: `src/styles/global.css:325-357`
- Modify: `src/scripts/carousel.ts:98-99, 102-113`
- Modify: `src/components/sections/Showcase.astro:39, 61-73`

- [ ] **Step 1 (item 5 — round arrows): Replace `.showcase-arrow` in `src/styles/global.css:353`.**

Old:
```css
.showcase-arrow{ padding: 10px 14px; font-size: 13px; }
```
New:
```css
.showcase-arrow{ width: 44px; height: 44px; padding: 0; font-size: 15px; line-height: 1;
  justify-content: center; flex: 0 0 auto; aspect-ratio: 1; }
```

- [ ] **Step 2 (item 4 — first card centered/featured): Replace the `.showcase-track` rule in `src/styles/global.css:325` and add spacers.**

Old:
```css
.showcase-track{ display: flex; gap: 24px; overflow-x: auto; padding: 30px 6vw; scroll-snap-type: x mandatory;
  scrollbar-width: none; cursor: grab; }
.showcase-track::-webkit-scrollbar{ display: none; }
```
New:
```css
.showcase-track{ display: flex; gap: 24px; overflow-x: auto; padding: 30px 0; scroll-snap-type: x mandatory;
  scrollbar-width: none; cursor: grab; }
.showcase-track::-webkit-scrollbar{ display: none; }
.showcase-track::before,
.showcase-track::after{ content: ''; flex: 0 0 max(6vw, calc((100% - clamp(360px, 50cqw, 600px)) / 2)); }
```
Also update the mobile padding in `src/styles/global.css:962`:
Old: `.showcase-track { padding: 24px 5vw; }`
New: `.showcase-track { padding: 24px 0; }`

- [ ] **Step 3 (item 4 — force featured index 0): In `src/scripts/carousel.ts`, replace lines 98-99** (the init tail of the `tracks.forEach`):

Old:
```ts
    centerOn(track, 0);
    computeAndDispatch();
  });
```
New (force first card active on load and ignore the auto-scroll's recompute briefly):
```ts
    centerOn(track, 0);
    setActive(track, 0);
    dispatchActive(track, { index: 0, slug: track.querySelector<HTMLElement>('.showcase-card')?.dataset.slug ?? '' });
    let initGuard = true;
    window.setTimeout(() => { initGuard = false; }, 250);
    track.addEventListener('scroll', () => {
      if (initGuard) { initGuard = false; }
    }, { passive: true, once: true });
  });
```
And in the `bubble:change` handler (lines 102-113), replace the body so the swapped-in carousel features card 0:

Old:
```ts
  window.addEventListener('bubble:change', () => {
    // After a bubble swap, the formerly-hidden carousel is now visible.
    // Center on card 0 first, then re-run active-card detection so the meta strip stays accurate.
    tracks.forEach((track) => {
      centerOn(track, 0);
      const result = findActiveCard(track);
      if (!result) return;
      setActive(track, result.index);
      const slug = result.card.dataset.slug ?? '';
      dispatchActive(track, { index: result.index, slug });
    });
  });
```
New:
```ts
  window.addEventListener('bubble:change', () => {
    // After a bubble swap, the formerly-hidden carousel is now visible.
    // Feature the FIRST card so the meta strip + active styling start at index 0.
    tracks.forEach((track) => {
      centerOn(track, 0);
      setActive(track, 0);
      const slug = track.querySelector<HTMLElement>('.showcase-card')?.dataset.slug ?? '';
      dispatchActive(track, { index: 0, slug });
    });
  });
```

> Note: the debounced `scroll` listener (line 63) still keeps `active` in sync once the user drags/scrolls. The spacers (Step 2) make card 0 the genuine nearest-center on load, so this is belt-and-suspenders.

- [ ] **Step 4 (item 6 — rounded preview corners): In `src/styles/global.css`, after `.showcase-screen` (line 340) add fill+inherit rules.**

Old:
```css
.showcase-screen{ position: absolute; inset: 14px; border-radius: 16px; overflow: hidden; }
```
New:
```css
.showcase-screen{ position: absolute; inset: 14px; border-radius: 18px; overflow: hidden; }
.showcase-screen > .placeholder-cover{ width: 100%; height: 100%; aspect-ratio: auto; border-radius: inherit; }
.showcase-screen > img{ width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit; }
```

- [ ] **Step 5 (item 13 — no text inside preview): In `src/components/sections/Showcase.astro:39`, drop the `label` prop** so no studio name renders inside the placeholder (the title/sub overlay outside the preview stays).

Old:
```astro
            <div class="showcase-screen"><Placeholder cover={cover} glyph="◆" label={item.data.studio} /></div>
```
New:
```astro
            <div class="showcase-screen"><Placeholder cover={cover} glyph="◆" /></div>
```

- [ ] **Step 6 (item 15-dots — hide dots when ≤1 item): In `src/components/sections/Showcase.astro`, render the dots wrapper only when there is more than one item.** Replace lines 61-73:

Old:
```astro
    <div class="showcase-dots" role="tablist" aria-label="Project">
      {items.map((_, i) => (
        <button
          type="button"
          class:list={['showcase-dot', { active: i === 0 }]}
          data-dot
          data-index={i}
          data-no-splash
          data-cursor="link"
          aria-label={`${i + 1}`}
        ></button>
      ))}
    </div>
```
New:
```astro
    {items.length > 1 && (
      <div class="showcase-dots" role="tablist" aria-label="Project">
        {items.map((_, i) => (
          <button
            type="button"
            class:list={['showcase-dot', { active: i === 0 }]}
            data-dot
            data-index={i}
            data-no-splash
            data-cursor="link"
            aria-label={`${i + 1}`}
          ></button>
        ))}
      </div>
    )}
```
Apply the identical guard to `src/components/visual/Gallery.astro:68-80` (wrap that `.showcase-dots` block in `{slides.length > 1 && (...)}`).

- [ ] **Step 7: Verify** — `npm run typecheck && npm run lint && npm run build`, then `npm run dev`. Confirm: arrows are perfect circles; the **first** card is the big/active one on load with its meta in the strip; preview corners are fully rounded; no studio text overlaps inside the preview; dots disappear for a single-item category. **Take a browser screenshot of a showcase card and confirm item 6's square-corner complaint is gone — if a square corner remains, inspect which layer (frame/screen/placeholder/chrome) is the culprit and round it before committing.**

- [ ] **Step 8: Commit**

```bash
git add src/styles/global.css src/scripts/carousel.ts src/components/sections/Showcase.astro src/components/visual/Gallery.astro
git commit -m "feat(carousel): round arrows, feature first card, rounded previews, hide single dots, drop in-preview label"
```

---

## Task 3: Marquee — subtle size + sans-serif typography (items 9, 10)

**Files:** Modify `src/styles/global.css:164-206`

> Follow the PDF "original" screenshots (small, sans, spaced), **not** `dreamy.jsx`.

- [ ] **Step 1: Replace `.marquee` and `.marquee-item` rules.**

Old (`src/styles/global.css:164-206`):
```css
.marquee {
  overflow: hidden;
  white-space: nowrap;
  padding: 28px 0;
  border-top: 0.5px solid var(--c-line);
  border-bottom: 0.5px solid var(--c-line);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```
New:
```css
.marquee {
  overflow: hidden;
  white-space: nowrap;
  padding: 16px 0;
  border-top: 0.5px solid var(--c-line);
  border-bottom: 0.5px solid var(--c-line);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```
Old (`.marquee-item`, lines 189-206):
```css
.marquee-item {
  display: inline-flex;
  align-items: center;
  padding: 0 28px;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(40px, 7cqw, 110px);
  line-height: 1;
  color: var(--c-ink);
}

.marquee-item::after {
  content: attr(data-sep);
  color: var(--c-accent);
  font-style: normal;
  margin-left: 56px;
}
```
New:
```css
.marquee-item {
  display: inline-flex;
  align-items: center;
  padding: 0 18px;
  font-family: var(--font-body);
  font-style: normal;
  font-weight: 500;
  font-size: clamp(13px, 1.4cqw, 20px);
  letter-spacing: 0.04em;
  line-height: 1;
  color: var(--c-ink);
}

.marquee-item::after {
  content: attr(data-sep);
  color: var(--c-accent);
  font-style: normal;
  margin-left: 30px;
}
```

- [ ] **Step 2: Verify** — `npm run build`, then `npm run dev`. The marquee should now read as a slim sans-serif band with accent ✦ separators (compare to the PDF "Original" screenshots for items 9 & 10). Tweak the `clamp`/letter-spacing if it still reads too large.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(marquee): restrained sans-serif band per original reference"
```

---

## Task 4: Meta strip in a centered bubble (item 8)

**Files:** Modify `src/styles/global.css:423-453`

> `dreamy.jsx:618` wraps the Studio/Role/Sectors/Year strip in a centered `.glass-card`. Restore that.

- [ ] **Step 1: Replace `.portfolio-meta-strip` + its `> div` rule.**

Old (`src/styles/global.css:423-447`):
```css
.portfolio-meta-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2.5rem 12vw 0;
  font-family: var(--font-body);
  font-size: 0.8rem;
}

.portfolio-meta-strip > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
```
New (wrap as a glass bubble, centered with a max width, sit inside section padding):
```css
.portfolio-meta-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 2.5rem auto 0;
  max-width: min(880px, 88vw);
  padding: 22px clamp(20px, 3vw, 32px);
  font-family: var(--font-body);
  font-size: 0.8rem;
  background: var(--c-glass);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border: .5px solid var(--c-glass-border);
  border-radius: 22px;
  box-shadow: var(--shadow-glass);
}

:root[data-theme='dark'] .portfolio-meta-strip {
  background: rgba(255, 255, 255, .05);
  border-color: rgba(255, 255, 255, .1);
  box-shadow: 0 1px 0 rgba(255, 255, 255, .08) inset, 0 18px 50px -12px rgba(0, 0, 0, .5);
}

.portfolio-meta-strip > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
```

- [ ] **Step 2: Verify** — `npm run build` + `npm run dev`. The meta strip is now a centered rounded glass bubble (matches the PDF "original" for item 8), in both light and dark. Confirm the `@media (max-width:720px)` 2-column rule (line 449) still applies.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(portfolio): meta strip as centered glass bubble"
```

---

## Task 5: Cursor ring label fit (item 7)

**Files:** Modify `src/styles/global.css:71-91`, `src/scripts/cursor.ts:26-49`

> Long labels ("PHOTOGRAPHY", "AI DESIGNS / IMAGE EDITING") fill the 96 px media ring edge-to-edge. Shrink + pad so text never touches the rim.

- [ ] **Step 1: In `src/styles/global.css`, tighten `#cursor-ring` text.** Edit lines 84-91 (the text properties block):

Old:
```css
  color: #fff;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0 6px;
}
```
New:
```css
  color: #fff;
  font-family: var(--font-body);
  font-size: 9.5px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0 14px;
  box-sizing: border-box;
  overflow: hidden;
}
```

- [ ] **Step 2: In `src/scripts/cursor.ts`, scale the font down further for long labels.** Replace the label line in `applyMode` (line 46):

Old:
```ts
  // eslint-disable-next-line no-param-reassign
  ringEl.textContent = (mode === 'media' && label) ? label : '';
```
New:
```ts
  if (mode === 'media' && label) {
    // eslint-disable-next-line no-param-reassign
    ringEl.textContent = label;
    // long labels get a smaller type size so they never reach the ring edge
    rs.fontSize = label.length > 10 ? '8px' : '9.5px';
  } else {
    // eslint-disable-next-line no-param-reassign
    ringEl.textContent = '';
    rs.fontSize = '';
  }
```

- [ ] **Step 3: Verify** — `npm run typecheck && npm run lint && npm run build`, then `npm run dev` on a desktop (fine-pointer) browser. Hover a showcase card; the "DRAWING"/"PHOTOGRAPHY" cursor label sits inside the circle with margin to the rim. Note: cursor is disabled on coarse pointers — test with a mouse.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/scripts/cursor.ts
git commit -m "fix(cursor): keep media-ring label inside the circle"
```

---

## Task 6: Section text spacing + "Explore more" button (items 3, 11, 12)

**Files:** Modify `src/styles/global.css:368-371,392-399`, `src/components/sections/PortfolioSection.astro:117-126`, `src/scripts/bubble-selector.ts:66-72`, `src/i18n/en.json:38`, `src/i18n/es.json:38`

- [ ] **Step 1 (items 3 + 12 — more separation between blurb and bubbles): In `src/styles/global.css`, add breathing room.**

Edit `.portfolio-blurb` (line 369):
Old: `.portfolio-blurb{ font-size: 15px; line-height: 1.55; color: var(--c-ink-soft); max-width: 540px; margin-top: 16px; }`
New: `.portfolio-blurb{ font-size: 15px; line-height: 1.55; color: var(--c-ink-soft); max-width: 540px; margin-top: 20px; }`

Edit `.portfolio-bubbles` (line 392) — add `margin-top`:
Old:
```css
.portfolio-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0 6vw;
}
```
New:
```css
.portfolio-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 0 6vw;
}
```
Also give the `.sec-title`→blurb a touch more space by editing `.portfolio-head` (line 368):
Old: `.portfolio-head{ padding: 0 6vw; text-align: left; }`
New: `.portfolio-head{ padding: 0 6vw; text-align: left; }` *(unchanged — the title already has its own line-height; the blurb `margin-top:20px` + bubbles `margin-top:2rem` cover items 3 & 12).*

- [ ] **Step 2 (item 11 — button text): Change the i18n string.**
  - `src/i18n/en.json:38`: `"explore": "Explore the case",` → `"explore": "Explore more",`
  - `src/i18n/es.json:38`: `"explore": "Explorar el caso",` → `"explore": "Explorar más",`

- [ ] **Step 3 (item 11 — button markup): In `src/components/sections/PortfolioSection.astro:117-126`, drop the `— {label} →` suffix.**

Old:
```astro
  <div class="portfolio-explore">
    <a
      class="btn btn-glass"
      data-explore
      data-cursor="link"
      href={localizedHref(lang, `/${kind}/${initial.data.slug}/`)}
    >
      {t('explore')} — <span data-explore-label>{initial.data.label[lang]}</span> →
    </a>
  </div>
```
New (keep the trailing arrow as a forward affordance; href still tracks the selected category):
```astro
  <div class="portfolio-explore">
    <a
      class="btn btn-glass"
      data-explore
      data-cursor="link"
      href={localizedHref(lang, `/${kind}/${initial.data.slug}/`)}
    >
      {t('explore')} →
    </a>
  </div>
```

- [ ] **Step 4 (item 11 — drop label sync): In `src/scripts/bubble-selector.ts`, remove the explore-label update** (the `data-explore-label` span no longer exists). Replace lines 66-72:

Old:
```ts
      const explore = section.querySelector<HTMLAnchorElement>('[data-explore]');
      if (explore) {
        const href = explore.getAttribute('href') ?? '';
        explore.setAttribute('href', href.replace(/[^/]+\/$/, `${categorySlug}/`));
        const exploreLabel = section.querySelector<HTMLElement>('[data-explore-label]');
        if (exploreLabel) exploreLabel.textContent = label;
      }
```
New:
```ts
      const explore = section.querySelector<HTMLAnchorElement>('[data-explore]');
      if (explore) {
        const href = explore.getAttribute('href') ?? '';
        explore.setAttribute('href', href.replace(/[^/]+\/$/, `${categorySlug}/`));
      }
```

- [ ] **Step 5: Verify** — `npm run typecheck && npm run lint && npm run build`, then `npm run dev`. The blurb has clear separation above the category bubbles in both Design and Artwork sections; the explore button reads "Explore more →" and still navigates to the currently selected category's subpage when bubbles change. Check the Spanish home (`/es/`) shows "Explorar más →".

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/sections/PortfolioSection.astro src/scripts/bubble-selector.ts src/i18n/en.json src/i18n/es.json
git commit -m "feat(portfolio): more text spacing and 'Explore more' button"
```

---

## Task 7: (folded into Task 5/6 numbering above — skip)

*(Intentionally empty: items 7 and 11 are covered by Tasks 5 and 6. Renumbering kept to avoid churn.)*

---

## Task 8: Contact social icons — lighter, white strokes, round (item 14)

**Files:** Modify `src/styles/global.css:500-510`

- [ ] **Step 1: Replace `.contact-social` + `img` rules.**

Old:
```css
.contact-socials { display: flex; gap: 14px; justify-content: center; margin: 22px 0 0; padding: 0; list-style: none; }
.contact-social {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--c-ink);
}
.contact-social img { width: 24px; height: 24px; }
```
New:
```css
.contact-socials { display: flex; gap: 14px; justify-content: center; margin: 22px 0 0; padding: 0; list-style: none; }
.contact-social {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--c-ink);
  background: rgba(255, 255, 255, .14);
  transition: background .2s, transform .2s;
}
.contact-social:hover { background: rgba(255, 255, 255, .24); transform: translateY(-2px); }
:root[data-theme='dark'] .contact-social { background: rgba(255, 255, 255, .12); }
:root[data-theme='dark'] .contact-social:hover { background: rgba(255, 255, 255, .2); }
.contact-social img { width: 24px; height: 24px; filter: brightness(0) invert(1); opacity: .92; }
```

- [ ] **Step 2: Verify** — `npm run build` + `npm run dev` → `/#contact`. Icons are perfectly round, the buttons sit on a slightly lighter glass tone, and the icon strokes render white in both themes.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(contact): lighter round social buttons with white icons"
```

---

## Task 9: Subpage — centered related bubbles + data-driven pagination (items 16, 15-subpage)

**Files:** Modify `src/components/sections/SubpageGrid.astro:17-19,61-71,73-83`, `src/styles/global.css:639-657`

- [ ] **Step 1 (item 15-subpage — real pagination): In `src/components/sections/SubpageGrid.astro`, compute page count and only show pagination when there is more than one page, using the `← 1 ··· N →` style.**

First, edit the projects query (lines 17-19) to keep the full count before slicing:
Old:
```astro
const projects = (await getCollection('projects', ({ data }) => (
  data.kind === category.data.kind && data.category === category.data.slug
))).slice(0, 8);
```
New:
```astro
const PAGE_SIZE = 8;
const allCategoryProjects = await getCollection('projects', ({ data }) => (
  data.kind === category.data.kind && data.category === category.data.slug
));
const projects = allCategoryProjects.slice(0, PAGE_SIZE);
const pageCount = Math.ceil(allCategoryProjects.length / PAGE_SIZE);
```

Then replace the pagination block (lines 61-71):
Old:
```astro
  <div class="subpage-pagination">
    {[1, 2, 3].map((page) => (
      <button
        type="button"
        class="subpage-page-dot"
        aria-label={`${t('subpage.pageOf')} ${page}`}
        aria-current={page === 1 ? 'true' : 'false'}
        data-cursor="link"
      ></button>
    ))}
  </div>
```
New:
```astro
  {pageCount > 1 && (
    <div class="subpage-pagination">
      <button type="button" class="btn btn-glass subpage-page-arrow" aria-label={t('detail.prev')} data-no-splash data-cursor="link">←</button>
      <span class="subpage-page-count">1 · · · {pageCount}</span>
      <button type="button" class="btn btn-glass subpage-page-arrow" aria-label={t('detail.next')} data-no-splash data-cursor="link">→</button>
    </div>
  )}
```

- [ ] **Step 2 (item 16 — center related bubbles): In `src/styles/global.css`, center the sister-bubble row and replace dot styling with arrow styling.**

Edit `.subpage-pagination` + dot rules (lines 618-637). Replace:
```css
.subpage-pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.subpage-page-dot {
  appearance: none;
  width: 8px;
  height: 8px;
  border: 1px solid var(--c-ink);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.subpage-page-dot[aria-current='true'] {
  background: var(--c-ink);
}
```
With:
```css
.subpage-pagination {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  margin-top: 2.5rem;
}

.subpage-page-arrow { width: 44px; height: 44px; padding: 0; aspect-ratio: 1; justify-content: center; font-size: 15px; }

.subpage-page-count {
  font-size: 12px;
  color: var(--c-ink-faint);
  letter-spacing: .1em;
  font-weight: 600;
}
```
Edit `.subpage-sister-bubbles` (line 639) to center:
Old:
```css
.subpage-sister-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-line);
}
```
New:
```css
.subpage-sister-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-line);
}
```
Also center the related-categories label: in `src/components/sections/SubpageGrid.astro:32-34`, append `text-align: center;` to `relatedLabelStyle`:
Old: `+ 'color: var(--c-ink-soft); margin-top: 4rem;';`
New: `+ 'color: var(--c-ink-soft); margin-top: 4rem; text-align: center;';`

- [ ] **Step 3: Verify** — `npm run typecheck && npm run lint && npm run build`, then visit a subpage (`/design/branding/`). With ≤8 projects the pagination is gone; the related label + sister bubbles are centered. If a category has >8 projects, the `← 1 ··· N →` row appears.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/SubpageGrid.astro src/styles/global.css
git commit -m "feat(subpage): data-driven pagination and centered related categories"
```

---

## Task 10: Project detail — plain category label + larger gallery (items 17, 18)

**Files:** Modify `src/styles/global.css:923,934-935`

- [ ] **Step 1 (item 17 — plain label): Replace `.detail-tag` so the category reads as low-contrast plain text (no fill/border/pill).**

Old (`src/styles/global.css:923`):
```css
.detail-tag{ position: static; display: inline-block; }
```
New (override the inherited `.showcase-tag` chrome):
```css
.detail-tag{ position: static; display: inline-block; padding: 0; background: none; border: 0;
  backdrop-filter: none; -webkit-backdrop-filter: none; color: var(--c-ink-faint);
  font-size: 11px; letter-spacing: .14em; }
```

- [ ] **Step 2 (item 18 — larger images): Widen the gallery and its cards.** Edit `.gallery` (line 934) and add a card-size override.

Old:
```css
.gallery{ margin: 24px 0; container-type: inline-size; }
.gallery .showcase-screen img{ width: 100%; height: 100%; object-fit: cover; }
```
New:
```css
.gallery{ margin: 24px 0; container-type: inline-size; }
.gallery .showcase-screen img{ width: 100%; height: 100%; object-fit: cover; }
.gallery .showcase-card{ flex-basis: clamp(520px, 80cqw, 920px); }
.gallery .showcase-frame{ aspect-ratio: auto; }
```
> The `.detail` wrapper is `max-width: 1100px`; cards now fill far more of that width than the prior `clamp(360px,50cqw,600px)`, removing the wasted side space the screenshot flagged. The track spacers from Task 2 keep the first/active image centered.

- [ ] **Step 3: Verify** — `npm run build` + `npm run dev` → open any project (e.g. `/design/ai-designs/<project>/`). The category label above the title is now quiet plain text; the gallery images are noticeably larger and centered, with arrows round (from Task 2) and dots hidden for single-image galleries (Task 2 Step 6).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(detail): quiet category label and larger gallery images"
```

---

## Task 11: Hero video opacity overlay (item 20)

**Files:** Modify `src/styles/global.css:283-285`

- [ ] **Step 1: Strengthen `.hero-scrim` with a darkening layer beneath the text.**

Old:
```css
.hero-scrim{ position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse 75% 55% at 50% 48%,
    color-mix(in srgb, var(--c-bg) 30%, transparent), transparent 72%); }
```
New (flat dark wash + the existing focal radial; sits above the video at z-index 1, below content at z-index 2):
```css
.hero-scrim{ position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    radial-gradient(ellipse 75% 55% at 50% 48%, rgba(8, 10, 20, .35), transparent 72%),
    linear-gradient(180deg, rgba(8, 10, 20, .35) 0%, rgba(8, 10, 20, .45) 100%); }
```

- [ ] **Step 2: Verify** — `npm run build` + `npm run dev`. The hero text (name, lede, CTAs, top row) reads clearly over the video; the overlay darkens the footage without hiding it. Tune the alpha (`.35`/`.45`) up or down against the actual video.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(hero): darkening overlay between video and text"
```

---

## Task 12: Mobile reorganization (item 19)

> Largest, most iterative item. Goal per the PDF mockup: on phones, replace the wrapping pill-nav with a **hamburger menu**, stack the home/category/detail content cleanly, and make showcase cards full-width. Pixel-matching the mockup is iterative — land a clean, coherent mobile layout, then refine against screenshots.

**Files:**
- Modify: `src/components/layout/Header.astro` (add hamburger button + `data-mobile-nav` wrapper)
- Create: `src/scripts/mobile-nav.ts`
- Modify: `src/styles/global.css` (mobile `@media` blocks at lines 942-981)

- [ ] **Step 1: Add a hamburger toggle to `src/components/layout/Header.astro`.** Insert immediately after the opening `<header class="site-header">` (line 34) a button, and add `id="nav-center"` to the `<nav class="nav-center">`:

```astro
  <button class="nav-burger" type="button" aria-label="Menu" aria-expanded="false"
    aria-controls="nav-center" data-nav-burger data-cursor="link">
    <span></span><span></span><span></span>
  </button>
```
Change the nav opening tag (line 41) to:
```astro
  <nav class="nav-center" id="nav-center" aria-label={t('nav.home')}>
```

- [ ] **Step 2: Create `src/scripts/mobile-nav.ts`.**

```ts
export const initMobileNav = (): void => {
  if (typeof document === 'undefined') return;
  const burger = document.querySelector<HTMLButtonElement>('[data-nav-burger]');
  const nav = document.getElementById('nav-center');
  if (!burger || !nav) return;

  const setOpen = (open: boolean): void => {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-mobile-open', open);
    document.body.classList.toggle('nav-locked', open);
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
};
```
Wire it in `src/layouts/BaseLayout.astro` body script (alongside `initSmoothScroll`):
```astro
      import { initMobileNav } from '../scripts/mobile-nav';
      ...
      initMobileNav();
```

- [ ] **Step 3: Style the hamburger + mobile menu in `src/styles/global.css`.** Add near the nav rules (after line 898):

```css
.nav-burger{ display: none; justify-self: end; width: 42px; height: 42px; padding: 0; border: 0;
  background: rgba(255,255,255,.6); border: .5px solid var(--c-glass-border); border-radius: 999px;
  backdrop-filter: blur(20px); flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  cursor: pointer; }
.nav-burger span{ width: 16px; height: 1.5px; background: var(--c-ink); border-radius: 2px; transition: all .25s; }
.nav-burger[aria-expanded='true'] span:nth-child(1){ transform: translateY(5.5px) rotate(45deg); }
.nav-burger[aria-expanded='true'] span:nth-child(2){ opacity: 0; }
.nav-burger[aria-expanded='true'] span:nth-child(3){ transform: translateY(-5.5px) rotate(-45deg); }
:root[data-theme='dark'] .nav-burger{ background: rgba(255,255,255,.06); }
body.nav-locked{ overflow: hidden; }
```

- [ ] **Step 4: Rework the mobile `@media (max-width: 768px)` and `(max-width: 480px)` blocks** (lines 948-981) so the nav becomes a drop panel behind the hamburger and content stacks. Replace the `.site-header`/nav lines inside `@media (max-width: 768px)` (lines 949-955) with:

```css
  .site-header { padding: 12px 16px; grid-template-columns: auto 1fr; }
  .nav-burger { display: inline-flex; }
  .brand .brand-last { display: none; }
  .nav-center {
    position: fixed; top: 64px; left: 12px; right: 12px;
    flex-direction: column; align-items: stretch; gap: 4px; padding: 12px;
    border-radius: 22px; max-height: calc(100vh - 80px); overflow: auto;
    opacity: 0; transform: translateY(-8px); pointer-events: none; transition: opacity .2s, transform .2s;
  }
  .nav-center.is-mobile-open { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .nav-link { padding: 12px 14px; font-size: 15px; justify-content: space-between; }
  .nav-link span[aria-hidden] { display: inline; }
  .mega { top: 64px; padding: 18px 16px 22px; }
  .mega-grid { grid-template-columns: 1fr 1fr; }
```
Keep the existing hero/portfolio/sub-grid/detail lines in that block (lines 957-968) — they already stack reasonably. Then in `@media (max-width: 480px)` **remove** the now-obsolete header reflow (lines 973-976: `.site-header`, `.nav-center`, `.brand`, `.nav-right` order rules) since the hamburger handles small screens; keep `.sub-grid`, `.contact-socials`, `.contact-social`, `.hero-ctas` rules.

- [ ] **Step 5: Verify** — `npm run typecheck && npm run lint && npm run build`, then `npm run dev` and use browser devtools responsive mode (e.g. 390 px). Confirm: hamburger appears and toggles a drop panel; Design/Artwork still open their mega; tapping a link closes the menu; home sections, category grids, and project detail all stack without overflow. Compare against the PDF item 19 mockup and refine spacing/typography. **Take mobile screenshots of home, a category page, and a project page.**

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.astro src/scripts/mobile-nav.ts src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat(mobile): hamburger nav and stacked responsive layout"
```

---

## Final verification & PR

- [ ] **Step 1: Full clean check** — `npm run typecheck && npm run lint && npm run build` (all must pass with zero warnings).
- [ ] **Step 2: Strip metadata** from any new/changed real photo assets per the asset-metadata-hygiene rule (none expected this round — only code/CSS — but confirm).
- [ ] **Step 3: Visual sweep** in `npm run dev` (and `npm run preview` to test the built `base` path) across home, both portfolio sections, a subpage, a project detail, and contact, in **light + dark** and **desktop + mobile**. Re-check each PDF item against its screenshot.
- [ ] **Step 4: Open the PR** from `feature/phase-2-feedback-round` → `main` with `gh`, body listing the 20 items and how each was addressed.

---

## Self-Review (completed during planning)

- **Spec coverage:** all 20 PDF items mapped to a task (see the item→task table). ✅
- **Placeholder scan:** every code step contains the actual old/new code. ✅
- **Consistency:** `suppressScrollClose` (Task 1), `initGuard` (Task 2), `PAGE_SIZE`/`pageCount` (Task 9) names are used consistently within their tasks; `.showcase-arrow` circle sizing (Task 2) is reused by `.subpage-page-arrow` (Task 9). ✅
- **Open risks flagged for in-browser confirmation:** item 6 (which layer shows a square corner), item 7 (cursor only on fine pointers), item 9/10 (marquee sizing is a judgment call vs the screenshot), item 18 (gallery width vs `.detail` max-width), item 19 (mobile is iterative). Each has an explicit screenshot/verify step.
