# Phase 1 Mega-Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate the prototype's `dreamy.jsx` into the Astro + vanilla-TS scaffold from Phase 0, delivering a fully visual + interactive portfolio with all 7 motion items, EN/ES UI parity, and 72 placeholder project entries — leaving only Carolina's real content for swap-in.

**Architecture:** Three layers built inside-out: motion primitives (vanilla TS modules in `src/scripts/`), visual primitives (Astro components in `src/components/visual/`), and section components (Astro components in `src/components/sections/`) consuming both. Components communicate via two `CustomEvent`s on `window`: `bubble:change` and `carousel:active`. All scripts are deferred body-bottom modules; no React. `prefers-reduced-motion` and `pointer: coarse` disable interactive motion as specified per item.

**Tech Stack:** Astro 6.3.1, TypeScript 6.0.3 strict, plain CSS with custom properties, IntersectionObserver + scroll-snap CSS, `requestAnimationFrame` lerp loops, mulberry32 PRNG for deterministic build-time randomness, Google Fonts CDN (Phase 0 baseline).

**Spec reference:** [`docs/superpowers/specs/2026-05-08-phase-1-mega-design.md`](../specs/2026-05-08-phase-1-mega-design.md)

**Branch:** `feature/phase-1-design` (already created off `feature/phase-0-scaffold`; HEAD `a67875a`)

**Commit policy:**
- Jericho subject: capitalized infinitive verb (`Add`, `Update`, `Configure`, `Implement`, `Replace`, `Refactor`, …), no period, ≤72 chars.
- Body: explains *why*, not *what*. Wrapped at ~72 chars.
- **No `Co-Authored-By` trailer.** Per the project memory rule, the AI co-author trailer is added only on scaffolding (Phase 0) commits.
- All commits GPG-signed; signing is auto-configured for this repo.

---

## File Structure

The plan creates these files (additions to Phase 0). Each file has one clear responsibility.

```
portfolio-web-app-ciruela/
├─ scripts/
│  └─ seed-placeholders.mjs                # Node script, generates 72 JSONs   [Task 21]
├─ src/
│  ├─ utils/
│  │  ├─ mulberry32.ts                     # seeded PRNG                       [Task 6]
│  │  └─ slug-hash.ts                      # slug → hue (200..320)             [Task 6]
│  ├─ scripts/
│  │  ├─ cursor.ts                         # custom morphing cursor            [Task 2]
│  │  ├─ splash.ts                         # paint-splash on click             [Task 3]
│  │  ├─ reveal.ts                         # IntersectionObserver reveals      [Task 4]
│  │  ├─ marquee.ts                        # doubled-track marquee             [Task 5]
│  │  ├─ jellyfish-drift.ts                # drift + scroll-fade               [Task 8]
│  │  ├─ carousel.ts                       # initCarousel + initTiltGrid       [Task 12, 17]
│  │  └─ bubble-selector.ts                # bubble selector + meta strip      [Task 13]
│  ├─ components/
│  │  ├─ visual/
│  │  │  ├─ Jellyfish.astro                                                    [Task 7]
│  │  │  ├─ Sparkles.astro                                                     [Task 9]
│  │  │  ├─ Placeholder.astro                                                  [Task 10]
│  │  │  ├─ CardPlaceholder.astro                                              [Task 17]
│  │  │  └─ Marquee.astro                                                      [Task 5]
│  │  └─ sections/
│  │     ├─ Hero.astro                                                         [Task 11]
│  │     ├─ Showcase.astro                                                     [Task 12]
│  │     ├─ PortfolioSection.astro                                             [Task 13]
│  │     ├─ Contact.astro                                                      [Task 16]
│  │     └─ SubpageGrid.astro                                                  [Task 17]
│  ├─ pages/
│  │  ├─ index.astro                       # rewrite to full homepage          [Task 14]
│  │  ├─ es/index.astro                    # rewrite                           [Task 14]
│  │  ├─ design/[category].astro           # rewrite to subpage                [Task 18]
│  │  ├─ artwork/[category].astro          # rewrite                           [Task 18]
│  │  └─ es/{design,artwork}/[category].astro  # rewrite                       [Task 18]
│  ├─ layouts/
│  │  └─ BaseLayout.astro                  # mount cursor + splash + reveal    [Task 1]
│  ├─ styles/
│  │  ├─ tokens.css                        # add motion tokens                 [Task 1]
│  │  └─ global.css                        # add cursor/splash/reveal CSS      [Task 1]
│  ├─ i18n/
│  │  ├─ en.json                           # +22 keys                          [Task 19]
│  │  └─ es.json                           # +22 keys                          [Task 19]
│  └─ content/
│     └─ projects/
│        ├─ design/<6 categories>/01..08-<slug>.json   # 48 placeholders       [Task 21]
│        └─ artwork/<3 categories>/01..08-<slug>.json  # 24 placeholders       [Task 21]
└─ docs/superpowers/
   ├─ specs/2026-05-08-phase-1-mega-design.md       # exists
   └─ plans/2026-05-08-phase-1-mega-design.md       # this file
```

**No barrel files** (Jericho non-negotiable). Each consumer imports directly from the source path.

---

## Tasks

### Task 1: Foundation — motion tokens, body data attributes, BaseLayout script mounts

**Goal:** Land the CSS tokens for motion timings, the body-level attributes that motion modules read (`data-pointer-coarse`, `data-reduced-motion`), and the `<script>` tags that lazy-load `cursor.ts`, `splash.ts`, `reveal.ts` from BaseLayout. None of those scripts exist yet — Tasks 2/3/4 create them. This task only lands the wiring.

**Files:**
- Modify: `src/styles/tokens.css` — add motion tokens (already partial; add cursor, splash, reveal-specific CSS variables)
- Modify: `src/styles/global.css` — add CSS rules for cursor visibility, splash drops, reveal-from states
- Modify: `src/layouts/BaseLayout.astro` — add an inline body-class init for reduced-motion / pointer-coarse, mount cursor/splash/reveal via deferred `<script>` tags

- [ ] **Step 1: Append motion tokens to `src/styles/tokens.css`**

After the existing dark-theme block, append:

```css
/* motion */
:root {
  --motion-cursor-lerp: 0.18;
  --motion-splash-duration: 620ms;
  --motion-reveal-duration: 480ms;
  --motion-reveal-distance: 24px;
  --motion-reveal-mask-duration: 700ms;
  --motion-marquee-default: 32s;
  --motion-drift-baseline: 14s;

  --c-splash-1: var(--c-accent);
  --c-splash-2: #A8B5FA;
  --c-splash-3: #D4DCFF;
  --c-splash-4: #C5B8FF;
  --c-splash-5: #9F8CFF;
}
```

- [ ] **Step 2: Append cursor + splash + reveal CSS rules to `src/styles/global.css`**

Append at end of file:

```css
/* ----- custom cursor (cursor.ts hydrates) ----- */

#cursor-dot,
#cursor-ring {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

#cursor-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--c-ink);
  margin-left: -2.5px;
  margin-top: -2.5px;
  transition: opacity 120ms;
}

#cursor-ring {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--c-ink);
  margin-left: -14px;
  margin-top: -14px;
  transition: width 220ms ease, height 220ms ease, border-color 180ms,
    background-color 180ms, margin 220ms ease;
}

body.no-cursor,
body.no-cursor * {
  cursor: auto;
}
body.has-cursor,
body.has-cursor * {
  cursor: none;
}
body.no-cursor #cursor-dot,
body.no-cursor #cursor-ring {
  display: none;
}

/* ----- paint splash (splash.ts spawns elements) ----- */

.splash-drop {
  position: fixed;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  animation: splash-fly var(--motion-splash-duration) cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes splash-fly {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(0.4);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(180deg) scale(1.2);
    opacity: 0;
  }
}

/* ----- scroll reveals (reveal.ts toggles data-revealed) ----- */

[data-reveal] {
  opacity: 0;
  transform: translateY(var(--motion-reveal-distance));
  transition: opacity var(--motion-reveal-duration) var(--ease-standard),
    transform var(--motion-reveal-duration) var(--ease-standard);
}

[data-reveal][data-revealed='true'] {
  opacity: 1;
  transform: translateY(0);
}

[data-reveal-mask] {
  display: inline-block;
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--motion-reveal-mask-duration) var(--ease-standard);
}

[data-reveal-mask][data-revealed='true'] {
  clip-path: inset(0 0 0 0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal],
  [data-reveal-mask] {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 3: Update `src/layouts/BaseLayout.astro` to add body-attribute bootstrap and script mounts**

Find the `<script is:inline>` block in the head (the no-FOUC theme bootstrap from Phase 0) and append a second inline block immediately after it (still in `<head>`):

```astro
    <script is:inline>
      // Body-level capability flags for motion modules.
      // Inline so they're set before any deferred script reads them.
      (function () {
        try {
          var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
          var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (coarse) document.documentElement.dataset.pointerCoarse = 'true';
          if (reduced) document.documentElement.dataset.reducedMotion = 'true';
          document.body && document.body.classList.add(coarse || reduced ? 'no-cursor' : 'has-cursor');
        } catch (e) {
          /* fall back silently */
        }
      })();
    </script>
```

Then modify the closing of `<body>`. Change from:

```astro
  <body>
    <Header lang={lang} />
    <slot />
    <Footer lang={lang} />
  </body>
```

to:

```astro
  <body>
    <Header lang={lang} />
    <slot />
    <Footer lang={lang} />

    <script>
      import { initCursor } from '../scripts/cursor';
      import { initSplash } from '../scripts/splash';
      import { initReveal } from '../scripts/reveal';

      initCursor();
      initSplash('#7A8FF7');
      initReveal();
    </script>
  </body>
```

> **Note:** the `<script>` block is an Astro processed module (no `is:inline`), so Vite will bundle it. The three imports will fail to resolve until Tasks 2/3/4 create the modules — that's expected and Step 5 below holds the commit until those land.

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors. The CSS-only changes don't affect typecheck. The new `<script>` block will be type-checked but the missing modules are caught at build, not typecheck.

- [ ] **Step 5: Hold the commit until Tasks 2/3/4 land**

Do **not** commit the BaseLayout changes yet — they reference modules that don't exist. Commit only the CSS changes for now:

```bash
git add src/styles/tokens.css src/styles/global.css
git commit -m "Add motion tokens and CSS for cursor, splash, and reveals

Phase 1 motion stack needs CSS scaffolding before its TS modules land.
Tokens carry the durations and palette derivatives the modules read.
Global rules cover cursor visibility classes, the splash-fly keyframe,
and the data-reveal/data-reveal-mask transition pair. Reduced-motion
neutralizes all of them via a single media-query block."
```

Verify signature:
```bash
git log --show-signature -1 | head -10
```

Expected: `Good signature from "Jose Ríos <josed.riosc@gmail.com>"`.

The BaseLayout edits stay uncommitted in the working tree until Task 4. **Re-stage and commit them at the end of Task 4** along with whatever Task 4 adds.

---

### Task 2: `cursor.ts` — custom morphing cursor

**Goal:** Vanilla TS module that injects a dot+ring into the body, follows the pointer with a `requestAnimationFrame` lerp loop, morphs over `[data-cursor]` hover targets, and self-disables on touch + reduced-motion.

**Files:**
- Create: `src/scripts/cursor.ts`

- [ ] **Step 1: Write `src/scripts/cursor.ts`**

```ts
type CursorMode = 'link' | 'media' | 'drag' | null;

const SHOULD_DISABLE = (): boolean => {
  if (typeof window === 'undefined') return true;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return coarse || reduced;
};

const ensureNodes = (): { dot: HTMLDivElement; ring: HTMLDivElement } => {
  let dot = document.getElementById('cursor-dot') as HTMLDivElement | null;
  let ring = document.getElementById('cursor-ring') as HTMLDivElement | null;
  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);
  }
  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);
  }
  return { dot, ring };
};

const applyMode = (ring: HTMLDivElement, dot: HTMLDivElement, mode: CursorMode, accent: string): void => {
  const sizes: Record<Exclude<CursorMode, null>, number> = { link: 56, media: 96, drag: 72 };
  const ringSize = mode === null ? 28 : sizes[mode];
  const half = ringSize / 2;
  ring.style.width = `${ringSize}px`;
  ring.style.height = `${ringSize}px`;
  ring.style.marginLeft = `${-half}px`;
  ring.style.marginTop = `${-half}px`;
  if (mode === 'media') {
    ring.style.background = accent;
    ring.style.borderColor = 'transparent';
  } else if (mode === 'drag') {
    ring.style.background = 'transparent';
    ring.style.border = `1.5px dashed ${accent}`;
  } else {
    ring.style.background = 'transparent';
    ring.style.border = '1.5px solid var(--c-ink)';
  }
  dot.style.opacity = mode === null ? '1' : '0';
};

export const initCursor = (accent: string = '#7A8FF7'): void => {
  if (typeof document === 'undefined') return;
  if (SHOULD_DISABLE()) {
    document.body.classList.remove('has-cursor');
    document.body.classList.add('no-cursor');
    return;
  }

  document.body.classList.remove('no-cursor');
  document.body.classList.add('has-cursor');

  const { dot, ring } = ensureNodes();

  const target = { x: -100, y: -100 };
  const dotPos = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  const lerp = 0.18;
  let mode: CursorMode = null;

  const updateMode = (next: CursorMode): void => {
    if (next !== mode) {
      mode = next;
      applyMode(ring, dot, mode, accent);
    }
  };

  const onMove = (e: PointerEvent): void => {
    target.x = e.clientX;
    target.y = e.clientY;
    const el = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
    const next = (el?.dataset.cursor as CursorMode) ?? null;
    updateMode(next);
  };

  window.addEventListener('pointermove', onMove, { passive: true });

  const tick = (): void => {
    dotPos.x = target.x;
    dotPos.y = target.y;
    ringPos.x += (target.x - ringPos.x) * lerp;
    ringPos.y += (target.y - ringPos.y) * lerp;
    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
};
```

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both exit 0.

- [ ] **Step 3: Stage but do not commit yet**

```bash
git add src/scripts/cursor.ts
```

Hold the commit until Task 4. The current BaseLayout edits import this file, but `splash.ts` and `reveal.ts` are still missing — committing now would leave the build broken.

---

### Task 3: `splash.ts` — paint splash on click

**Goal:** Vanilla TS module that listens for clicks on `document` and spawns 8 colored drops at the click coordinates, animating outward via the `splash-fly` CSS keyframe and self-removing on `animationend`.

**Files:**
- Create: `src/scripts/splash.ts`

- [ ] **Step 1: Write `src/scripts/splash.ts`**

```ts
const PALETTE = [
  'var(--c-splash-1)',
  'var(--c-splash-2)',
  'var(--c-splash-3)',
  'var(--c-splash-4)',
  'var(--c-splash-5)',
] as const;

const SHOULD_DISABLE = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const spawnDrop = (x: number, y: number, angleDeg: number, distance: number, color: string): void => {
  const drop = document.createElement('span');
  drop.className = 'splash-drop';
  const radians = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(radians) * distance;
  const dy = Math.sin(radians) * distance;
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  drop.style.background = `radial-gradient(circle at 30% 30%, ${color} 0%, transparent 70%)`;
  drop.style.setProperty('--dx', `${dx}px`);
  drop.style.setProperty('--dy', `${dy}px`);
  drop.addEventListener('animationend', () => {
    drop.remove();
  }, { once: true });
  document.body.appendChild(drop);
};

export const initSplash = (_accent: string = '#7A8FF7'): void => {
  if (typeof document === 'undefined') return;
  if (SHOULD_DISABLE()) return;

  document.addEventListener('click', (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const drops = 8;
    const baseDistance = 60;
    for (let i = 0; i < drops; i += 1) {
      const angle = (360 / drops) * i + (Math.random() - 0.5) * 20;
      const distance = baseDistance + Math.random() * 40;
      const color = PALETTE[i % PALETTE.length] ?? PALETTE[0];
      spawnDrop(x, y, angle, distance, color);
    }
  });
};
```

> **Note:** the `_accent` parameter is unused for now (palette uses CSS vars) but kept in the signature so BaseLayout's call site stays stable. ESLint's `no-unused-vars` rule allows leading-underscore names.

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both exit 0.

- [ ] **Step 3: Stage but do not commit yet**

```bash
git add src/scripts/splash.ts
```

Still hold the commit until Task 4 lands `reveal.ts`.

---

### Task 4: `reveal.ts` + commit Tasks 1–4 as one foundation commit

**Goal:** IntersectionObserver-based scroll reveal hydrator. Then commit Tasks 1, 2, 3, 4 together as the foundational motion-primitives commit.

**Files:**
- Create: `src/scripts/reveal.ts`

- [ ] **Step 1: Write `src/scripts/reveal.ts`**

```ts
const SHOULD_AUTO_REVEAL = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const initReveal = (): void => {
  if (typeof document === 'undefined') return;

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-mask]');

  if (SHOULD_AUTO_REVEAL()) {
    targets.forEach((el) => {
      el.dataset.revealed = 'true';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const delayAttr = el.dataset.revealDelay;
        const delay = delayAttr ? Number.parseInt(delayAttr, 10) : 0;
        if (delay > 0) {
          window.setTimeout(() => {
            el.dataset.revealed = 'true';
          }, delay);
        } else {
          el.dataset.revealed = 'true';
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach((el) => observer.observe(el));
};
```

- [ ] **Step 2: Verify the full build now succeeds end-to-end**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: all three exit 0. The build resolves the three imports in `BaseLayout.astro` (cursor, splash, reveal) and bundles them as a deferred body-bottom script.

- [ ] **Step 3: Confirm script bundles into `dist/`**

```bash
grep -rE 'initCursor|initSplash|initReveal' dist/ | head -3
```

Expected: at least one match showing the bundled module in `dist/_astro/`.

- [ ] **Step 4: Stage all four files and commit as one foundation commit**

```bash
git add src/scripts/cursor.ts src/scripts/splash.ts src/scripts/reveal.ts src/layouts/BaseLayout.astro
git commit -m "Add cursor, splash, and reveal motion primitives

Three vanilla TS modules form the foundation the rest of the motion
stack depends on. cursor.ts injects a dot+ring pair, lerps to the
pointer at 0.18 per frame, and morphs over data-cursor hover targets.
splash.ts spawns 8 radial-gradient drops on click using the five
splash-color tokens. reveal.ts uses one IntersectionObserver across
all data-reveal and data-reveal-mask elements with a threshold of 0.3.
Each module short-circuits on prefers-reduced-motion; cursor also
disables on pointer: coarse. BaseLayout deferred-loads all three from
a body-bottom script tag."
```

Verify signature:
```bash
git log --show-signature -1 | head -10
```

Expected: `Good signature from "Jose Ríos <josed.riosc@gmail.com>"`.

---

### Task 5: `marquee.ts` + `Marquee.astro` — doubled-track marquee

**Goal:** `marquee.ts` clones the inner content once at hydration so the track holds two copies side by side; CSS animates the clone via `translateX(0 → -50%)`. `Marquee.astro` is the visual primitive that wraps content in this structure.

**Files:**
- Create: `src/scripts/marquee.ts`
- Create: `src/components/visual/Marquee.astro`

- [ ] **Step 1: Write `src/scripts/marquee.ts`**

```ts
export const initMarquee = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;

  const containers = (root ?? document).querySelectorAll<HTMLElement>('[data-marquee]');
  containers.forEach((container) => {
    const track = container.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;
    if (track.dataset.marqueeHydrated === 'true') return;
    const clone = track.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    container.appendChild(clone);
    track.dataset.marqueeHydrated = 'true';
  });
};
```

- [ ] **Step 2: Append marquee CSS to `src/styles/global.css`**

Append at end of file:

```css
/* ----- marquee (Marquee.astro + marquee.ts) ----- */

[data-marquee] {
  display: flex;
  overflow: hidden;
  width: 100%;
  gap: 1.5rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--c-line);
  border-bottom: 1px solid var(--c-line);
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  color: var(--c-ink-soft);
}

[data-marquee-track] {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
  animation: marquee-x var(--motion-marquee-default) linear infinite;
  white-space: nowrap;
}

[data-marquee]:hover [data-marquee-track] {
  animation-play-state: paused;
}

[data-marquee-item] {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
}

[data-marquee-item]::after {
  content: attr(data-sep);
  color: var(--c-accent);
  font-style: normal;
}

@keyframes marquee-x {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  [data-marquee-track] {
    animation: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 3: Write `src/components/visual/Marquee.astro`**

```astro
---
interface Props {
  items: string[];
  sep?: string;
  speedSec?: number;
}

const { items, sep = '✦', speedSec = 32 } = Astro.props;
const trackStyle = `--motion-marquee-default: ${speedSec}s;`;
---
<div class="marquee" data-marquee style={trackStyle}>
  <div class="marquee-track" data-marquee-track>
    {items.map((item) => (
      <span class="marquee-item" data-marquee-item data-sep={sep}>{item}</span>
    ))}
  </div>
</div>

<script>
  import { initMarquee } from '../../scripts/marquee';

  initMarquee();
</script>
```

- [ ] **Step 4: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: all 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/marquee.ts src/components/visual/Marquee.astro src/styles/global.css
git commit -m "Add Marquee visual primitive with doubled-track hydration

marquee.ts clones the track once at hydration so two copies sit side
by side, then CSS animates the pair from 0 to -50% on a configurable
duration. Hover pauses; prefers-reduced-motion freezes. Marquee.astro
takes items, separator glyph, and speed seconds and renders the
doubled-track skeleton. Items render the glyph after each label via a
::after rule using data-sep so localization is straightforward."
```

---

### Task 6: `mulberry32.ts` + `slug-hash.ts` — deterministic randomness utilities

**Goal:** Two pure-function utilities used by Jellyfish (tendril paths), Sparkles (positions/opacity), Placeholder (hue), and the seed-placeholders script. Mulberry32 is the seedable PRNG; slug-hash maps a string to a hue in [200, 320].

**Files:**
- Create: `src/utils/mulberry32.ts`
- Create: `src/utils/slug-hash.ts`

- [ ] **Step 1: Write `src/utils/mulberry32.ts`**

```ts
export const mulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return (): number => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
```

- [ ] **Step 2: Write `src/utils/slug-hash.ts`**

```ts
const stringHash = (s: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};

export const hueFromSlug = (slug: string): number => {
  const h = stringHash(slug);
  return 200 + (h % 121);
};

export const seedFromSlug = (slug: string): number => {
  return stringHash(slug);
};
```

- [ ] **Step 3: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/mulberry32.ts src/utils/slug-hash.ts
git commit -m "Add mulberry32 PRNG and slug-hash utilities

Two pure functions used wherever the build needs deterministic random
values: jellyfish tendril paths, sparkle positions, tilt rotations,
and placeholder cover hues. mulberry32 is a small fast PRNG seeded by
a 32-bit unsigned int; consumers seed it from a slug hash so the same
slug renders identically across builds. hueFromSlug maps any string
into the 200..320 degree range (cool periwinkle through magenta) so
placeholder gradients stay on-brand regardless of the slug provided."
```

---

### Task 7: `Jellyfish.astro` — SVG jellyfish with build-time tendril generation

**Goal:** Astro component that renders a single SVG jellyfish with bell + 22 tendrils. Tendril paths are computed in the frontmatter (build time) using mulberry32 seeded from `seed * 17 + 7` (matches prototype). No client-side RNG.

**Files:**
- Create: `src/components/visual/Jellyfish.astro`

- [ ] **Step 1: Write `src/components/visual/Jellyfish.astro`**

```astro
---
// utils
import { mulberry32 } from '../../utils/mulberry32';

interface Props {
  seed: number;
  size?: number;
  hue?: number;
  accent?: string;
  className?: string;
}

const { seed, size = 320, hue = 245, accent = '#7A8FF7', className = '' } = Astro.props;

const rng = mulberry32(seed * 17 + 7);
const tendrilCount = 22;

interface Tendril {
  path: string;
  opacity: number;
  width: number;
}

const tendrils: Tendril[] = [];
for (let i = 0; i < tendrilCount; i += 1) {
  const t = i / (tendrilCount - 1);
  const x0 = 60 + t * 280;
  const rimDip = Math.sin(t * Math.PI) * 12;
  const y0 = 348 + rimDip;
  const lenFactor = 0.55 + Math.sin(t * Math.PI) * 0.45 + rng() * 0.15;
  const len = 320 * lenFactor;
  const drift1 = (rng() - 0.5) * 60;
  const drift2 = (rng() - 0.5) * 80;
  const drift3 = (rng() - 0.5) * 40;
  const xMid = x0 + drift1;
  const xEnd = x0 + drift1 + drift2;
  const xTip = x0 + drift1 + drift2 + drift3;
  const yMid = y0 + len * 0.45;
  const yEnd = y0 + len * 0.8;
  const yTip = y0 + len;
  const path = `M ${x0} ${y0} C ${x0} ${y0 + 30}, ${xMid} ${yMid - 30}, ${xMid} ${yMid} S ${xEnd} ${yEnd - 20}, ${xEnd} ${yEnd} S ${xTip} ${yTip - 10}, ${xTip} ${yTip}`;
  const opacity = 0.35 + Math.sin(t * Math.PI) * 0.45 + rng() * 0.1;
  const width = 0.8 + rng() * 0.8;
  tendrils.push({ path, opacity, width });
}

const cBlue = `hsl(${hue} 90% 70%)`;
const cCyan = `hsl(${(hue + 25) % 360} 95% 78%)`;
const cViolet = `hsl(${(hue + 30) % 360} 85% 72%)`;
const cMagenta = `hsl(${(hue + 50) % 360} 80% 68%)`;
const idBase = `jelly-${seed}`;
---
<svg
  viewBox="0 0 400 760"
  width={size}
  height={size * (760 / 400)}
  class={`jellyfish ${className}`}
  aria-hidden="true"
  data-seed={seed}
>
  <defs>
    <radialGradient id={`${idBase}-bell`} cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color={cViolet} stop-opacity="0.95" />
      <stop offset="60%" stop-color={cBlue} stop-opacity="0.7" />
      <stop offset="100%" stop-color={cMagenta} stop-opacity="0.4" />
    </radialGradient>
    <radialGradient id={`${idBase}-rim`} cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color={cCyan} stop-opacity="0" />
      <stop offset="80%" stop-color={cCyan} stop-opacity="0.7" />
      <stop offset="100%" stop-color={cCyan} stop-opacity="0" />
    </radialGradient>
  </defs>

  <ellipse
    cx="200" cy="220" rx="170" ry="160"
    fill={`url(#${idBase}-bell)`}
  />

  <ellipse
    cx="200" cy="220" rx="180" ry="170"
    fill="none"
    stroke={`url(#${idBase}-rim)`}
    stroke-width="2"
    opacity="0.9"
  />

  <ellipse
    cx="170" cy="180" rx="55" ry="36"
    fill="white"
    opacity="0.45"
  />

  <g class="jelly-tendrils" stroke-linecap="round" fill="none">
    {tendrils.map((tendril, i) => (
      <path
        d={tendril.path}
        stroke={i % 7 === 0 ? cMagenta : i % 3 === 0 ? cCyan : cBlue}
        stroke-width={tendril.width}
        opacity={tendril.opacity}
      />
    ))}
  </g>

  <ellipse cx="200" cy="225" rx="80" ry="14" fill={accent} opacity="0.18" />
</svg>

<style>
  .jellyfish {
    display: block;
  }
</style>
```

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/visual/Jellyfish.astro
git commit -m "Add Jellyfish visual primitive with build-time tendril generation

Single SVG jellyfish: bell (radial gradient + rim halo + crown
highlight) plus 22 tendrils generated at build time via mulberry32
seeded by seed * 17 + 7, matching the prototype's deterministic
output. Color stops shift by hue offsets so callers vary appearance
without re-keying the SVG. Tendril stroke widths and opacities are
also rng-derived but baked into static markup so the output is
identical across builds for a given seed."
```

---

### Task 8: `jellyfish-drift.ts` — drift orchestrator + scroll-fade

**Goal:** Vanilla TS module that finds the hero's `[data-jellyfish-stage]` and assigns each child jellyfish independent CSS-driven drift via inline style variables, plus a scroll-fade rAF loop that updates `--hero-fade` on the stage element when the hero is in viewport.

**Files:**
- Create: `src/scripts/jellyfish-drift.ts`
- Modify: `src/styles/global.css` — append drift + parallax CSS

- [ ] **Step 1: Append jellyfish drift CSS to `src/styles/global.css`**

```css
/* ----- jellyfish drift (jellyfish-drift.ts hydrates) ----- */

[data-jellyfish-stage] {
  position: relative;
  --hero-fade: 1;
}

[data-jellyfish-stage] .jellyfish-slot {
  position: absolute;
  --drift-x: 12px;
  --drift-y: 18px;
  --drift-rot: 4deg;
  --drift-duration: 14s;
  animation: jellyfish-drift var(--drift-duration) ease-in-out infinite alternate;
  opacity: var(--hero-fade);
  will-change: transform, opacity;
}

@keyframes jellyfish-drift {
  0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
  50%  { transform: translate3d(var(--drift-x), var(--drift-y), 0) rotate(var(--drift-rot)); }
  100% { transform: translate3d(calc(var(--drift-x) * -0.5), calc(var(--drift-y) * 0.6), 0) rotate(calc(var(--drift-rot) * -0.7)); }
}

@media (prefers-reduced-motion: reduce) {
  [data-jellyfish-stage] .jellyfish-slot {
    animation: none !important;
    transform: none !important;
  }
  [data-jellyfish-stage] {
    --hero-fade: 1 !important;
  }
}
```

- [ ] **Step 2: Write `src/scripts/jellyfish-drift.ts`**

```ts
const SHOULD_SKIP_PARALLAX = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface DriftConfig {
  x: number;
  y: number;
  rot: number;
  duration: number;
}

const DRIFTS: DriftConfig[] = [
  { x: 14, y: 22, rot: 5, duration: 13 },
  { x: -18, y: 16, rot: -4, duration: 17 },
  { x: 10, y: -14, rot: 3, duration: 19 },
];

export const initJellyfishDrift = (): void => {
  if (typeof document === 'undefined') return;

  const stage = document.querySelector<HTMLElement>('[data-jellyfish-stage]');
  if (!stage) return;

  const slots = stage.querySelectorAll<HTMLElement>('.jellyfish-slot');
  slots.forEach((slot, i) => {
    const cfg = DRIFTS[i % DRIFTS.length] ?? DRIFTS[0];
    if (!cfg) return;
    slot.style.setProperty('--drift-x', `${cfg.x}px`);
    slot.style.setProperty('--drift-y', `${cfg.y}px`);
    slot.style.setProperty('--drift-rot', `${cfg.rot}deg`);
    slot.style.setProperty('--drift-duration', `${cfg.duration}s`);
    slot.style.animationDelay = `${i * -2.7}s`;
  });

  if (SHOULD_SKIP_PARALLAX()) return;

  let inViewport = true;
  const io = new IntersectionObserver(([entry]) => {
    inViewport = entry?.isIntersecting ?? false;
  }, { threshold: 0 });
  io.observe(stage);

  let raf = 0;
  const tick = (): void => {
    if (inViewport) {
      const rect = stage.getBoundingClientRect();
      const fade = Math.max(0, Math.min(1, 1 - (-rect.top / 700)));
      stage.style.setProperty('--hero-fade', `${fade}`);
    }
    raf = window.requestAnimationFrame(tick);
  };
  raf = window.requestAnimationFrame(tick);
};
```

- [ ] **Step 3: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/jellyfish-drift.ts src/styles/global.css
git commit -m "Add jellyfish drift orchestrator and parallax fade

Three independent drift configurations (x/y/rot/duration) cycle through
the hero's jellyfish slots so each one moves on its own cadence.
Animation delay is staggered negatively so the three reach their
keyframes out of phase. A single rAF loop reads the stage's
boundingClientRect and writes --hero-fade as the user scrolls past
the hero, fading all jellyfish via the opacity rule. The IntersectionObserver
suspends the parallax read when the stage is out of viewport.
prefers-reduced-motion freezes both animations and parallax."
```

---

### Task 9: `Sparkles.astro` — 28 dots, build-time positions

**Goal:** Visual primitive that renders N sparkle dots inside an SVG. Positions, opacities, and animation delays are computed at build time via mulberry32 so the output is deterministic.

**Files:**
- Create: `src/components/visual/Sparkles.astro`
- Modify: `src/styles/global.css` — append sparkle CSS

- [ ] **Step 1: Append sparkle CSS to `src/styles/global.css`**

```css
/* ----- sparkles (Sparkles.astro) ----- */

.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.sparkles circle {
  animation: sparkle-twinkle 4.5s ease-in-out infinite;
}

@keyframes sparkle-twinkle {
  0%, 100% { opacity: var(--sparkle-base, 0.3); }
  50%      { opacity: 0.95; }
}

@media (prefers-reduced-motion: reduce) {
  .sparkles circle {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Write `src/components/visual/Sparkles.astro`**

```astro
---
// utils
import { mulberry32 } from '../../utils/mulberry32';

interface Props {
  count?: number;
  seed?: number;
}

const { count = 28, seed = 0 } = Astro.props;
const rng = mulberry32(seed * 31 + 11);

interface Sparkle {
  cx: number;
  cy: number;
  r: number;
  base: number;
  delay: number;
}

const sparkles: Sparkle[] = [];
for (let i = 0; i < count; i += 1) {
  sparkles.push({
    cx: rng() * 100,
    cy: rng() * 100,
    r: 0.3 + rng() * 0.9,
    base: 0.15 + rng() * 0.4,
    delay: rng() * -4.5,
  });
}
---
<svg class="sparkles" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  {sparkles.map((s) => (
    <circle
      cx={s.cx}
      cy={s.cy}
      r={s.r}
      fill="white"
      style={`--sparkle-base: ${s.base}; animation-delay: ${s.delay}s;`}
    />
  ))}
</svg>
```

- [ ] **Step 3: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/visual/Sparkles.astro src/styles/global.css
git commit -m "Add Sparkles visual primitive with 28 build-time dots

SVG sparkles with rng-derived positions, radii, base opacities, and
animation delays — all baked at build time so each render is
deterministic per seed. CSS keyframe pulses the opacity between the
per-dot base value and 0.95 every 4.5 seconds with staggered delays.
Reduced motion freezes the pulse."
```

---

### Task 10: `Placeholder.astro` — OKLCH gradient project cover

**Goal:** Visual primitive that renders a faux website screenshot with a colored OKLCH gradient. Takes `cover` URI like `placeholder:hue=240` (parsed) or a direct hue, plus optional glyph and label.

**Files:**
- Create: `src/components/visual/Placeholder.astro`
- Modify: `src/styles/global.css` — append placeholder CSS

- [ ] **Step 1: Append placeholder CSS to `src/styles/global.css`**

```css
/* ----- placeholder (Placeholder.astro) ----- */

.placeholder-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--placeholder-bg, linear-gradient(135deg, #7A8FF7, #A8B5FA));
  isolation: isolate;
}

.placeholder-chrome {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
}

.placeholder-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}

.placeholder-glyph {
  position: absolute;
  inset: 22px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(2rem, 6vw, 5rem);
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.placeholder-label {
  position: absolute;
  left: 12px;
  bottom: 10px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}
```

- [ ] **Step 2: Write `src/components/visual/Placeholder.astro`**

```astro
---
interface Props {
  cover: string;
  glyph?: string;
  label?: string;
}

const { cover, glyph = '◆', label } = Astro.props;

const parseHue = (uri: string): number => {
  const match = /^placeholder:hue=(\d+)$/.exec(uri);
  return match ? Number.parseInt(match[1] ?? '240', 10) : 240;
};

const hue = parseHue(cover);
const bg = `linear-gradient(135deg, oklch(82% 0.12 ${hue}) 0%, oklch(62% 0.15 ${(hue + 30) % 360}) 100%)`;
---
<div class="placeholder-cover" style={`--placeholder-bg: ${bg};`}>
  <div class="placeholder-chrome">
    <span class="placeholder-dot"></span>
    <span class="placeholder-dot"></span>
    <span class="placeholder-dot"></span>
  </div>
  <div class="placeholder-glyph">{glyph}</div>
  {label && <div class="placeholder-label">{label}</div>}
</div>
```

- [ ] **Step 3: Verify lint + typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: both 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/visual/Placeholder.astro src/styles/global.css
git commit -m "Add Placeholder visual primitive for project covers

Faux website screenshot with three modal dots in a glassy chrome
strip, a centered Fraunces italic glyph, and an optional uppercase
label in the corner. Cover URI follows the placeholder:hue=NNN
scheme; the hue maps into an OKLCH gradient that rotates 30 degrees
at the bottom corner so the gradient reads as a layered surface
instead of a flat fill. Real images replace the URI later without
changing component callers."
```

---

### Task 11: `Hero.astro` — three jellyfish + sparkles + Carolina Rivera wordmark + drift mount

**Goal:** Section component composing the hero. Renders three `<Jellyfish>` instances inside `[data-jellyfish-stage]`, plus `<Sparkles>` and the wordmark with reveal animations. Mounts `jellyfish-drift.ts`. The CTA button has `data-cursor="link"` so the custom cursor morphs over it.

**Files:**
- Create: `src/components/sections/Hero.astro`
- Modify: `src/styles/global.css` — append hero CSS

- [ ] **Step 1: Append hero CSS to `src/styles/global.css`**

```css
/* ----- hero (Hero.astro) ----- */

.hero-stage {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  overflow: hidden;
  container-type: inline-size;
}

.hero-jellyfish-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.jellyfish-slot {
  width: clamp(240px, 30vw, 420px);
}

.jellyfish-slot.slot-1 { left: 8%;  top: 12%; }
.jellyfish-slot.slot-2 { left: 42%; top: 4%;  }
.jellyfish-slot.slot-3 { right: 6%; top: 18%; }

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
  padding-top: 14vh;
}

.hero-wordmark {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 0.95;
  overflow: visible;
}

.hero-name-first {
  font-family: var(--font-name);
  font-weight: 500;
  font-size: clamp(64px, 14cqw, 180px);
  letter-spacing: -0.01em;
  color: var(--c-ink);
}

.hero-name-last {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(40px, 9cqw, 124px);
  margin-top: -0.15em;
  padding-bottom: 0.2em;
  background: linear-gradient(135deg, var(--c-accent) 0%, #9F8CFF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.hero-tagline {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-ink-soft);
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-pill);
  background: var(--c-bg-elev);
  border: 1px solid var(--c-line);
  color: var(--c-ink);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: 1rem;
  box-shadow: 0 0 0 4px var(--c-bg);
  transition: transform 200ms var(--ease-standard);
}

.hero-cta:hover {
  transform: translateY(-2px);
}
```

- [ ] **Step 2: Write `src/components/sections/Hero.astro`**

```astro
---
// utils
import { localizedHref } from '../../utils/localizedHref';

// components
import Jellyfish from '../visual/Jellyfish.astro';
import Sparkles from '../visual/Sparkles.astro';

// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = getT(lang);
---
<section class="hero-stage">
  <div class="hero-jellyfish-stage" data-jellyfish-stage>
    <div class="jellyfish-slot slot-1"><Jellyfish seed={3} hue={235} /></div>
    <div class="jellyfish-slot slot-2"><Jellyfish seed={11} hue={252} /></div>
    <div class="jellyfish-slot slot-3"><Jellyfish seed={29} hue={278} /></div>
    <Sparkles count={28} seed={7} />
  </div>

  <div class="hero-content">
    <h1 class="hero-wordmark">
      <span class="hero-name-first" data-reveal>{t('home.name.first')}</span>
      <span class="hero-name-last" data-reveal data-reveal-delay="120">{t('home.name.last')}</span>
    </h1>
    <p class="hero-tagline" data-reveal data-reveal-delay="240">{t('home.tagline')}</p>
    <a class="hero-cta" href={`${localizedHref(lang, '/')}#design`} data-cursor="link" data-reveal data-reveal-delay="360">
      {t('hero.cta')}
    </a>
  </div>
</section>

<script>
  import { initJellyfishDrift } from '../../scripts/jellyfish-drift';

  initJellyfishDrift();
</script>
```

> **Note:** `hero.cta` will be added to i18n in Task 19. Until then the build will fail at runtime when rendering. Tasks order this commit before the i18n update; build will pass typecheck (the key is just a string lookup) but the runtime-throw guard in `getT.resolve` will fire. **Add the i18n keys as part of this same commit** — Step 3 below.

- [ ] **Step 3: Add the hero i18n keys to `en.json` and `es.json`**

In `src/i18n/en.json`, after the existing `home.tagline` entry, add to the `home` block:

```json
{
  "home": {
    "name": { "first": "Carolina", "last": "Rivera" },
    "tagline": "Graphic Designer & Visual Artist"
  },
  "hero": {
    "cta": "View work"
  }
}
```

(Re-place the `hero` block at the top level alongside `home`, not inside it. The existing `home` block keeps its current shape.)

In `src/i18n/es.json`:
```json
"hero": {
  "cta": "Ver trabajo"
}
```

- [ ] **Step 4: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: all 0 errors. The build will compile the hero markup but the home pages still use the Phase 0 stub bodies — Task 14 mounts the Hero component in the pages.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.astro src/styles/global.css src/i18n/en.json src/i18n/es.json
git commit -m "Add Hero section with three jellyfish, sparkles, and wordmark

Three Jellyfish instances at fixed slots (left, center, right) with
seeded hues that span the locked periwinkle-to-violet range. Sparkles
inside the same stage so the IntersectionObserver tracks them as one
unit. Wordmark stacks Carolina (Jost 500) above Rivera (Fraunces
italic 300) with a violet-to-periwinkle gradient on Rivera. The CTA
carries data-cursor='link' so the custom cursor morphs over it. Each
text element animates in via the data-reveal stagger ladder. The
hero.cta i18n key lands here so getT does not throw on first render."
```

---

### Task 12: `carousel.ts` (initCarousel) + `Showcase.astro`

**Goal:** Carousel hydrator that emits `carousel:active` events, plus the Showcase Astro component that renders project cards inside the scroll-snap track. The tilted-grid initializer (`initTiltGrid`) lands in Task 17.

**Files:**
- Create: `src/scripts/carousel.ts`
- Create: `src/components/sections/Showcase.astro`
- Modify: `src/styles/global.css` — append carousel CSS

- [ ] **Step 1: Append carousel CSS to `src/styles/global.css`**

```css
/* ----- showcase carousel (Showcase.astro + carousel.ts) ----- */

.showcase {
  position: relative;
  width: 100%;
}

[data-carousel] {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 1rem 12vw;
  scrollbar-width: none;
}

[data-carousel]::-webkit-scrollbar {
  display: none;
}

.showcase-card {
  flex: 0 0 clamp(280px, 60vw, 640px);
  scroll-snap-align: center;
  border-radius: var(--radius-lg);
  background: var(--c-bg-elev);
  border: 1px solid var(--c-line);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transform: scale(0.92);
  opacity: 0.55;
  transition: transform 320ms var(--ease-standard), opacity 320ms var(--ease-standard);
  text-decoration: none;
  color: inherit;
}

.showcase-card[data-active='true'] {
  transform: scale(1);
  opacity: 1;
}

.showcase-card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0 0.5rem 0.5rem;
}

.showcase-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: -0.005em;
  color: var(--c-ink);
}

.showcase-card-subtitle {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--c-ink-soft);
}

.showcase-tag {
  position: absolute;
  top: 1rem;
  left: 12vw;
  z-index: 2;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-pill);
  padding: 0.25rem 0.625rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-ink-soft);
}

[data-theme='dark'] .showcase-tag {
  background: rgba(15, 15, 25, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.showcase-arrows {
  position: absolute;
  bottom: -2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.showcase-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--c-line);
  background: var(--c-bg-elev);
  color: var(--c-ink);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 2: Write `src/scripts/carousel.ts`**

```ts
interface CarouselActiveDetail {
  index: number;
  slug: string;
}

const findActiveCard = (track: HTMLElement): { index: number; card: HTMLElement } | null => {
  const cards = Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'));
  if (cards.length === 0) return null;
  const trackRect = track.getBoundingClientRect();
  const center = trackRect.left + trackRect.width / 2;
  let best = { index: 0, card: cards[0] as HTMLElement, distance: Infinity };
  cards.forEach((card, i) => {
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const d = Math.abs(cx - center);
    if (d < best.distance) {
      best = { index: i, card, distance: d };
    }
  });
  return { index: best.index, card: best.card };
};

const setActive = (track: HTMLElement, activeIdx: number): void => {
  const cards = track.querySelectorAll<HTMLElement>('.showcase-card');
  cards.forEach((card, i) => {
    card.dataset.active = i === activeIdx ? 'true' : 'false';
  });
};

const dispatchActive = (track: HTMLElement, detail: CarouselActiveDetail): void => {
  window.dispatchEvent(new CustomEvent<CarouselActiveDetail>('carousel:active', { detail }));
  track.dataset.activeIndex = String(detail.index);
};

export const initCarousel = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const tracks = (root ?? document).querySelectorAll<HTMLElement>('[data-carousel]');
  tracks.forEach((track) => {
    const computeAndDispatch = (): void => {
      const result = findActiveCard(track);
      if (!result) return;
      setActive(track, result.index);
      const slug = result.card.dataset.slug ?? '';
      dispatchActive(track, { index: result.index, slug });
    };

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    track.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(computeAndDispatch, 80);
    }, { passive: true });

    track.querySelectorAll<HTMLButtonElement>('[data-carousel-arrow]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.carouselArrow === 'next' ? 1 : -1;
        const cards = Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'));
        const currentIdx = Number.parseInt(track.dataset.activeIndex ?? '0', 10);
        const nextIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dir));
        cards[nextIdx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    track.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const cards = Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'));
        const currentIdx = Number.parseInt(track.dataset.activeIndex ?? '0', 10);
        const nextIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dir));
        cards[nextIdx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    computeAndDispatch();
  });
};

export type { CarouselActiveDetail };
```

- [ ] **Step 3: Write `src/components/sections/Showcase.astro`**

```astro
---
// utils
import { hueFromSlug } from '../../utils/slug-hash';

// components
import Placeholder from '../visual/Placeholder.astro';

// types
import type { CollectionEntry } from 'astro:content';

// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  items: CollectionEntry<'projects'>[];
  lang: Lang;
  category: string;
  categoryLabel: string;
}

const { items, lang, category, categoryLabel } = Astro.props;
const t = getT(lang);
---
<div class="showcase" data-showcase data-category={category}>
  <div class="showcase-tag">{categoryLabel}</div>

  <div data-carousel role="region" aria-roledescription="carousel" tabindex="0">
    {items.map((item) => {
      const hue = hueFromSlug(item.data.slug);
      const cover = item.data.cover.startsWith('placeholder:') ? item.data.cover : `placeholder:hue=${hue}`;
      return (
        <a class="showcase-card" data-slug={item.data.slug} data-category={category} href="#" data-cursor="media">
          <Placeholder cover={cover} glyph="◆" label={item.data.studio} />
          <div class="showcase-card-meta">
            <span class="showcase-card-title">{item.data.title[lang]}</span>
            <span class="showcase-card-subtitle">{item.data.subtitle[lang]}</span>
          </div>
        </a>
      );
    })}
  </div>

  <div class="showcase-arrows">
    <button type="button" class="showcase-arrow" data-carousel-arrow="prev" aria-label={t('showcase.prev')}>‹</button>
    <button type="button" class="showcase-arrow" data-carousel-arrow="next" aria-label={t('showcase.next')}>›</button>
  </div>
</div>

<script>
  import { initCarousel } from '../../scripts/carousel';

  initCarousel();
</script>
```

- [ ] **Step 4: Add showcase i18n keys to `en.json` and `es.json`**

In `en.json`, add a `showcase` block:
```json
"showcase": {
  "prev": "Previous project",
  "next": "Next project"
}
```

In `es.json`:
```json
"showcase": {
  "prev": "Proyecto anterior",
  "next": "Siguiente proyecto"
}
```

- [ ] **Step 5: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: 0 errors. Showcase isn't mounted on any page yet (Task 13 wraps it in PortfolioSection).

- [ ] **Step 6: Commit**

```bash
git add src/scripts/carousel.ts src/components/sections/Showcase.astro src/styles/global.css src/i18n/en.json src/i18n/es.json
git commit -m "Add carousel hydrator and Showcase section

carousel.ts hydrates [data-carousel] tracks: scroll-snap CSS handles
the snap mechanics, an 80ms-debounced scroll listener computes the
center-most card to set [data-active], and a CustomEvent named
carousel:active carries { index, slug } to any listeners. Arrow
buttons and ArrowLeft/Right keys scroll one card at a time. Showcase
renders an array of project entries as a horizontal track of cards
with Placeholder covers, deriving each card's gradient hue from its
slug hash. The showcase-tag bubble in the corner shows the active
category label."
```

---

### Task 13: `bubble-selector.ts` + `PortfolioSection.astro`

**Goal:** Section component that wraps `<Showcase>` with a bubble row + meta strip + eyebrow. The bubble selector hydrator handles category swap; the meta strip listens to `carousel:active` events and updates from the active project.

**Files:**
- Create: `src/scripts/bubble-selector.ts`
- Create: `src/components/sections/PortfolioSection.astro`
- Modify: `src/styles/global.css` — append portfolio-section CSS

- [ ] **Step 1: Append portfolio-section CSS to `src/styles/global.css`**

```css
/* ----- portfolio section (PortfolioSection.astro) ----- */

.portfolio-section {
  padding: 6rem 0 3rem;
  position: relative;
  scroll-margin-top: 80px;
}

.portfolio-eyebrow {
  display: flex;
  justify-content: center;
  gap: 0.5em;
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-ink-soft);
  margin-bottom: 1.5rem;
}

.portfolio-eyebrow .accent {
  color: var(--c-accent);
}

.portfolio-eyebrow .selected-category {
  color: var(--c-ink);
}

.portfolio-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

.portfolio-bubble {
  appearance: none;
  border: 1px solid var(--c-line);
  background: var(--c-bg-elev);
  color: var(--c-ink);
  border-radius: var(--radius-pill);
  padding: 0.4rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 200ms, color 200ms, transform 160ms var(--ease-standard);
}

.portfolio-bubble[aria-selected='true'] {
  background: var(--c-ink);
  color: var(--c-bg);
}

.portfolio-bubble:hover {
  transform: translateY(-1px);
}

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

.portfolio-meta-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-ink-soft);
}

.portfolio-meta-value {
  color: var(--c-ink);
}

@media (max-width: 720px) {
  .portfolio-meta-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 2: Write `src/scripts/bubble-selector.ts`**

```ts
import type { CarouselActiveDetail } from './carousel';

interface ProjectMeta {
  slug: string;
  studio: string;
  role: string;
  sectors: string;
  year: number;
}

const setEyebrow = (root: HTMLElement, label: string): void => {
  const slot = root.querySelector<HTMLElement>('[data-selected-category]');
  if (slot) slot.textContent = label;
};

const setMeta = (root: HTMLElement, project: ProjectMeta | undefined): void => {
  if (!project) return;
  const strip = root.querySelector<HTMLElement>('[data-meta-strip]');
  if (!strip) return;
  const set = (key: string, value: string): void => {
    const el = strip.querySelector<HTMLElement>(`[data-meta='${key}']`);
    if (el) el.textContent = value;
  };
  set('studio', project.studio);
  set('role', project.role);
  set('sectors', project.sectors);
  set('year', String(project.year));
};

const readProjects = (root: HTMLElement, categorySlug: string): ProjectMeta[] => {
  const blob = root.querySelector<HTMLScriptElement>(`[data-projects='${categorySlug}']`);
  if (!blob || !blob.textContent) return [];
  try {
    return JSON.parse(blob.textContent) as ProjectMeta[];
  } catch {
    return [];
  }
};

const filterShowcaseCards = (root: HTMLElement, categorySlug: string): void => {
  const showcases = root.querySelectorAll<HTMLElement>('[data-showcase]');
  showcases.forEach((sc) => {
    sc.style.display = sc.dataset.category === categorySlug ? '' : 'none';
  });
};

export const initBubbleSelector = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const sections = (root ?? document).querySelectorAll<HTMLElement>('[data-bubble-selector]');

  sections.forEach((section) => {
    const bubbles = section.querySelectorAll<HTMLButtonElement>('.portfolio-bubble');

    const activate = (categorySlug: string, label: string): void => {
      bubbles.forEach((b) => {
        b.setAttribute('aria-selected', b.dataset.category === categorySlug ? 'true' : 'false');
      });
      filterShowcaseCards(section, categorySlug);
      setEyebrow(section, label);
      const projects = readProjects(section, categorySlug);
      setMeta(section, projects[0]);
      window.dispatchEvent(new CustomEvent('bubble:change', { detail: { categorySlug } }));
    };

    bubbles.forEach((b) => {
      b.addEventListener('click', () => {
        const cat = b.dataset.category;
        const label = b.textContent ?? '';
        if (cat) activate(cat, label);
      });
    });

    window.addEventListener('carousel:active', (e: Event) => {
      const detail = (e as CustomEvent<CarouselActiveDetail>).detail;
      if (!detail) return;
      const activeBubble = section.querySelector<HTMLButtonElement>('.portfolio-bubble[aria-selected="true"]');
      const cat = activeBubble?.dataset.category;
      if (!cat) return;
      const projects = readProjects(section, cat);
      const found = projects.find((p) => p.slug === detail.slug);
      setMeta(section, found);
    });
  });
};
```

- [ ] **Step 3: Write `src/components/sections/PortfolioSection.astro`**

```astro
---
// packages
import { getCollection } from 'astro:content';

// components
import Showcase from './Showcase.astro';

// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  kind: 'design' | 'artwork';
  lang: Lang;
}

const { kind, lang } = Astro.props;
const t = getT(lang);
const sectionId = kind === 'design' ? 'design' : 'artwork';

const allCategories = await getCollection('categories', ({ data }) => data.kind === kind);
const allProjects = await getCollection('projects', ({ data }) => data.kind === kind);

const initial = allCategories[0];
if (!initial) throw new Error(`No categories found for kind=${kind}`);

const projectsByCategory = new Map<string, typeof allProjects>();
allCategories.forEach((cat) => {
  projectsByCategory.set(cat.data.slug, allProjects.filter((p) => p.data.category === cat.data.slug));
});

interface ProjectMeta {
  slug: string;
  studio: string;
  role: string;
  sectors: string;
  year: number;
}

const projectMetaByCategory = new Map<string, ProjectMeta[]>();
projectsByCategory.forEach((projects, slug) => {
  projectMetaByCategory.set(slug, projects.map((p) => ({
    slug: p.data.slug,
    studio: p.data.studio,
    role: p.data.role[lang],
    sectors: p.data.sectors.join(' · '),
    year: p.data.year,
  })));
});

const eyebrowKey = kind === 'design' ? 'design.eyebrow' : 'artwork.eyebrow';
const eyebrowLabel = t(eyebrowKey);
const initialProject = projectMetaByCategory.get(initial.data.slug)?.[0];
---
<section id={sectionId} class="portfolio-section" data-bubble-selector>
  <p class="portfolio-eyebrow">
    <span>—{eyebrowLabel.toUpperCase()}.</span>
    <span class="accent">{t('bubble.label').toUpperCase()}.</span>
    <span class="selected-category" data-selected-category>{initial.data.label[lang]}</span>
  </p>

  <div class="portfolio-bubbles" role="tablist">
    {allCategories.map((cat) => (
      <button
        type="button"
        class="portfolio-bubble"
        role="tab"
        data-category={cat.data.slug}
        aria-selected={cat.data.slug === initial.data.slug}
        data-cursor="link"
      >
        {cat.data.label[lang]}
      </button>
    ))}
  </div>

  {allCategories.map((cat) => {
    const items = projectsByCategory.get(cat.data.slug) ?? [];
    const isInitial = cat.data.slug === initial.data.slug;
    return (
      <div style={isInitial ? '' : 'display: none;'} data-showcase-wrapper={cat.data.slug}>
        <Showcase items={items} lang={lang} category={cat.data.slug} categoryLabel={cat.data.label[lang]} />
      </div>
    );
  })}

  <div class="portfolio-meta-strip" data-meta-strip aria-live="polite">
    <div>
      <span class="portfolio-meta-label">{t('meta.studio')}</span>
      <span class="portfolio-meta-value" data-meta="studio">{initialProject?.studio ?? ''}</span>
    </div>
    <div>
      <span class="portfolio-meta-label">{t('meta.role')}</span>
      <span class="portfolio-meta-value" data-meta="role">{initialProject?.role ?? ''}</span>
    </div>
    <div>
      <span class="portfolio-meta-label">{t('meta.sectors')}</span>
      <span class="portfolio-meta-value" data-meta="sectors">{initialProject?.sectors ?? ''}</span>
    </div>
    <div>
      <span class="portfolio-meta-label">{t('meta.year')}</span>
      <span class="portfolio-meta-value" data-meta="year">{initialProject?.year ?? ''}</span>
    </div>
  </div>

  {Array.from(projectMetaByCategory.entries()).map(([slug, projects]) => (
    <script type="application/json" data-projects={slug} set:html={JSON.stringify(projects)} />
  ))}
</section>

<script>
  import { initBubbleSelector } from '../../scripts/bubble-selector';

  initBubbleSelector();
</script>
```

> **Note:** the `<script type="application/json">` blocks are non-executable; bubble-selector.ts reads them via `textContent` and `JSON.parse` to look up project meta on `carousel:active` without re-fetching anything.

- [ ] **Step 4: Add the bubble + meta strip i18n keys to `en.json` and `es.json`**

In `en.json`, add to existing top-level structure:
```json
"bubble": { "label": "Selected" },
"meta": {
  "studio": "Studio",
  "role": "Role",
  "sectors": "Sectors",
  "year": "Year"
}
```

In `es.json`:
```json
"bubble": { "label": "Seleccionado" },
"meta": {
  "studio": "Estudio",
  "role": "Rol",
  "sectors": "Sectores",
  "year": "Año"
}
```

- [ ] **Step 5: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/bubble-selector.ts src/components/sections/PortfolioSection.astro src/styles/global.css src/i18n/en.json src/i18n/es.json
git commit -m "Add bubble-selector hydrator and PortfolioSection

PortfolioSection composes a category bubble row, an inline-script
JSON payload of project metadata per category, the active showcase
carousel, and the meta strip. bubble-selector.ts toggles aria-selected
on click, filters [data-showcase] blocks by data-category, updates
the eyebrow text, seeds the meta strip from the first project of the
new category, and dispatches bubble:change. It also listens to
carousel:active and re-keys the meta strip from the matching slug.
Project meta is rendered into application/json script blocks at
build time so the runtime hydrator only does JSON.parse — no fetches."
```

---

### Task 14: Mount Hero + two PortfolioSections + marquees on home pages

**Goal:** Replace the Phase-0 stub bodies of `src/pages/index.astro` and `src/pages/es/index.astro` with the full homepage flow: Hero → Marquee → Design portfolio → Marquee → Artwork portfolio → Marquee → (Contact placeholder).

The Contact section lands in Task 16; Task 14 leaves a stub `<section id="contact">` to satisfy the Header anchor.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/es/index.astro`

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
// layouts
import BaseLayout from '../layouts/BaseLayout.astro';

// components
import Hero from '../components/sections/Hero.astro';
import Marquee from '../components/visual/Marquee.astro';
import PortfolioSection from '../components/sections/PortfolioSection.astro';

// i18n
import { getT } from '../i18n/getT';

const lang = 'en' as const;
const t = getT(lang);
const marqueeItems = ['Brand', 'Editorial', 'Drawing', 'Illustration', 'UI', 'Identity', 'Print', 'Photography'];
---
<BaseLayout title={t('site.title')} description={t('site.description')} lang={lang}>
  <Hero lang={lang} />
  <Marquee items={marqueeItems} sep="✦" speedSec={32} />
  <PortfolioSection kind="design" lang={lang} />
  <Marquee items={marqueeItems} sep="✦" speedSec={28} />
  <PortfolioSection kind="artwork" lang={lang} />
  <Marquee items={marqueeItems} sep="✦" speedSec={36} />
  <section id="contact" style="padding: 6rem 1.5rem; min-height: 60vh;">
    <p style="text-align:center; color: var(--c-ink-soft);">Contact section lands in Task 16.</p>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Rewrite `src/pages/es/index.astro`**

```astro
---
// layouts
import BaseLayout from '../../layouts/BaseLayout.astro';

// components
import Hero from '../../components/sections/Hero.astro';
import Marquee from '../../components/visual/Marquee.astro';
import PortfolioSection from '../../components/sections/PortfolioSection.astro';

// i18n
import { getT } from '../../i18n/getT';

const lang = 'es' as const;
const t = getT(lang);
const marqueeItems = ['Marca', 'Editorial', 'Dibujo', 'Ilustración', 'UI', 'Identidad', 'Impresión', 'Fotografía'];
---
<BaseLayout title={t('site.title')} description={t('site.description')} lang={lang}>
  <Hero lang={lang} />
  <Marquee items={marqueeItems} sep="✦" speedSec={32} />
  <PortfolioSection kind="design" lang={lang} />
  <Marquee items={marqueeItems} sep="✦" speedSec={28} />
  <PortfolioSection kind="artwork" lang={lang} />
  <Marquee items={marqueeItems} sep="✦" speedSec={36} />
  <section id="contact" style="padding: 6rem 1.5rem; min-height: 60vh;">
    <p style="text-align:center; color: var(--c-ink-soft);">Sección de contacto en Task 16.</p>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: 0 errors. Build succeeds. The home pages will render with hero + marquees + both portfolio sections, but only the 2 Phase-0 stub projects are in the carousel until Task 21 seeds 72 placeholders.

- [ ] **Step 4: Smoke check the build output**

```bash
grep -c 'data-jellyfish-stage' dist/index.html dist/es/index.html
grep -c 'data-bubble-selector' dist/index.html dist/es/index.html
grep -c 'data-marquee' dist/index.html dist/es/index.html
```

Expected: each grep returns 1 for both files (one stage, two portfolio sections, three marquees per page → but grep `-c` counts lines so `data-marquee` is 3 per file).

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/es/index.astro
git commit -m "Replace home page stubs with full homepage composition

The English and Spanish home pages now render Hero, two
PortfolioSection blocks (design then artwork), three Marquee dividers
between them, and a placeholder Contact section that Task 16 fills in.
Carousels show only the 2 Phase-0 stub projects until Task 21 seeds
the 72 placeholder entries; everything else is end-to-end working."
```

---

### Task 15: Wire `data-cursor` on Header + Footer + ThemeToggle + LangToggle

**Goal:** The custom cursor's `link` mode needs to fire on every interactive element. Phase 0 layout components don't have `data-cursor` attributes yet. Add them.

**Files:**
- Modify: `src/components/layout/Header.astro`
- Modify: `src/components/layout/Footer.astro`
- Modify: `src/components/layout/ThemeToggle.astro`
- Modify: `src/components/layout/LangToggle.astro`

- [ ] **Step 1: Add `data-cursor="link"` to all anchor and button elements in Header.astro**

Find each `<a>` and `<button>` element in the existing Header and add `data-cursor="link"`. The brand link, the Home anchor, the Design and Artwork mega-menu triggers, the Contact anchor, every submenu link, and any future controls should carry this attribute. Apply via Edit tool, one element at a time.

- [ ] **Step 2: Add `data-cursor="link"` to Footer social links**

In `src/components/layout/Footer.astro`, find each `<a href={item.href}>` inside the socials map and add `data-cursor="link"`.

- [ ] **Step 3: Add `data-cursor="link"` to ThemeToggle and LangToggle buttons**

In each toggle component, the two `<button type="button" data-theme-button="...">` (or `data-lang-button`) elements get `data-cursor="link"`.

- [ ] **Step 4: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.astro src/components/layout/Footer.astro src/components/layout/ThemeToggle.astro src/components/layout/LangToggle.astro
git commit -m "Wire data-cursor link mode on layout interactive elements

Every anchor and button in Header, Footer, ThemeToggle, and
LangToggle gets data-cursor='link' so cursor.ts morphs the ring to
its 56px solid-border state on hover. The carousel cards already
carry data-cursor='media' (96px filled disk); the rest of the
interactive surface needed the link variant."
```

---

### Task 16: `Contact.astro` — restructured per Ref Contact sketch

**Goal:** Replace the Task-14 placeholder Contact section with the full layout: heading + three weighted lines + email Copy card on the left; "Send a message" form (Name / Email / Message / Send) + four social bubbles on the right.

**Files:**
- Create: `src/components/sections/Contact.astro`
- Modify: `src/pages/index.astro` and `src/pages/es/index.astro` — replace the Task-14 placeholder
- Modify: `src/styles/global.css` — append contact CSS

- [ ] **Step 1: Append contact CSS to `src/styles/global.css`**

```css
/* ----- contact (Contact.astro) ----- */

.contact-section {
  padding: 6rem clamp(1.5rem, 5vw, 4.5rem) 6rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4rem);
  scroll-margin-top: 80px;
}

@media (max-width: 720px) {
  .contact-section {
    grid-template-columns: 1fr;
  }
}

.contact-left {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-heading {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5cqw, 4.5rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.01em;
  color: var(--c-ink);
  line-height: 1;
}

.contact-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--font-body);
}

.contact-meta-line {
  font-size: 1rem;
  color: var(--c-ink);
}

.contact-meta-line.subtle {
  color: var(--c-ink-soft);
  font-size: 0.85rem;
}

.contact-email-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--c-bg-elev);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  gap: 1rem;
}

.contact-email-address {
  font-size: 0.95rem;
  color: var(--c-ink);
  word-break: break-all;
}

.contact-copy-button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--c-line);
  background: var(--c-bg);
  color: var(--c-ink);
  font-family: var(--font-body);
  font-size: 0.8rem;
  cursor: pointer;
  flex-shrink: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-ink-soft);
}

.contact-form input,
.contact-form textarea {
  appearance: none;
  border: 1px solid var(--c-line);
  background: var(--c-bg-elev);
  color: var(--c-ink);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  text-transform: none;
  letter-spacing: normal;
}

.contact-form textarea {
  min-height: 9rem;
  resize: vertical;
}

.contact-send {
  appearance: none;
  border: 0;
  background: var(--c-ink);
  color: var(--c-bg);
  border-radius: var(--radius-pill);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-start;
}

.contact-socials {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.contact-socials a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--c-line);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--c-ink);
}
```

- [ ] **Step 2: Write `src/components/sections/Contact.astro`**

```astro
---
// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = getT(lang);
const email = t('contact.email');

const socials: ReadonlyArray<{ key: string; href: string; icon: string; label: string }> = [
  { key: 'behance',   href: 'https://www.behance.net/',   icon: 'behance.svg',   label: 'Behance'   },
  { key: 'instagram', href: 'https://www.instagram.com/', icon: 'instagram.svg', label: 'Instagram' },
  { key: 'linkedin',  href: 'https://www.linkedin.com/',  icon: 'linkedin.svg',  label: 'LinkedIn'  },
  { key: 'whatsapp',  href: 'https://wa.me/',             icon: 'whatsapp.svg',  label: 'WhatsApp'  },
];
---
<section id="contact" class="contact-section" data-reveal>
  <div class="contact-left">
    <h2 class="contact-heading">{t('contact.heading')}</h2>
    <div class="contact-meta">
      <span class="contact-meta-line">{t('contact.line1')}</span>
      <span class="contact-meta-line subtle">{t('contact.line2')}</span>
      <span class="contact-meta-line subtle">{t('contact.line3')}</span>
    </div>
    <div class="contact-email-card">
      <span class="contact-email-address">{email}</span>
      <button type="button" class="contact-copy-button" data-cursor="link" data-copy-target={email}>
        {t('contact.ctaCopy')}
      </button>
    </div>
  </div>

  <form class="contact-form" action={`mailto:${email}`} method="post" enctype="text/plain">
    <label>
      {t('contact.form.name.label')}
      <input type="text" name="name" required placeholder={t('contact.form.name.placeholder')} data-cursor="link" />
    </label>
    <label>
      {t('contact.form.email.label')}
      <input type="email" name="email" required placeholder={t('contact.form.email.placeholder')} data-cursor="link" />
    </label>
    <label>
      {t('contact.form.message.label')}
      <textarea name="message" required placeholder={t('contact.form.message.placeholder')} data-cursor="link"></textarea>
    </label>
    <button type="submit" class="contact-send" data-cursor="link">{t('contact.form.send')}</button>

    <ul class="contact-socials" role="list">
      {socials.map((s) => (
        <li>
          <a href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" data-cursor="link">
            <img src={`${import.meta.env.BASE_URL}icons/${s.icon}`} alt="" width="20" height="20" />
          </a>
        </li>
      ))}
    </ul>
  </form>
</section>

<script>
  document.querySelectorAll<HTMLButtonElement>('.contact-copy-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = btn.dataset.copyTarget;
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target);
        const original = btn.textContent;
        btn.textContent = btn.dataset.copiedLabel ?? 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1600);
      } catch {
        // clipboard blocked; no-op
      }
    });
  });
</script>
```

- [ ] **Step 3: Add the contact i18n keys to `en.json` and `es.json`**

In `en.json`:
```json
"contact": {
  "heading": "Get in touch",
  "line1": "I'm Carolina — graphic designer and visual artist.",
  "line2": "Currently based in Mexico, working remotely worldwide.",
  "line3": "Open to commissions, residencies, and collaborations.",
  "ctaCopy": "Copy email",
  "email": "hello@carolinariverart.com",
  "form": {
    "name": { "label": "Name", "placeholder": "Your full name" },
    "email": { "label": "Email", "placeholder": "you@example.com" },
    "message": { "label": "Tell me about it", "placeholder": "What are you working on?" },
    "send": "Send message",
    "sent": "Sent",
    "copied": "Copied"
  }
}
```

In `es.json`:
```json
"contact": {
  "heading": "Contáctame",
  "line1": "Soy Carolina — diseñadora gráfica y artista visual.",
  "line2": "Basada en México, trabajo en remoto a nivel mundial.",
  "line3": "Abierta a encargos, residencias y colaboraciones.",
  "ctaCopy": "Copiar correo",
  "email": "hello@carolinariverart.com",
  "form": {
    "name": { "label": "Nombre", "placeholder": "Tu nombre completo" },
    "email": { "label": "Correo", "placeholder": "tu@ejemplo.com" },
    "message": { "label": "Cuéntame", "placeholder": "¿En qué estás trabajando?" },
    "send": "Enviar mensaje",
    "sent": "Enviado",
    "copied": "Copiado"
  }
}
```

> **Note:** The Phase-0 i18n had a top-level `contact` block with only `heading` and `ctaCopy`. The new structure replaces it. Keep the same key names where they overlap.

- [ ] **Step 4: Replace the Task-14 placeholder section in both home pages**

In `src/pages/index.astro`, replace the placeholder `<section id="contact">…</section>` with:
```astro
<Contact lang={lang} />
```
And add the import at the top:
```astro
import Contact from '../components/sections/Contact.astro';
```

Same in `src/pages/es/index.astro` with `'../../components/sections/Contact.astro'`.

- [ ] **Step 5: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Contact.astro src/styles/global.css src/i18n/en.json src/i18n/es.json src/pages/index.astro src/pages/es/index.astro
git commit -m "Add Contact section restructured per Ref Contact

Two-column grid: left side carries the heading, three weighted intro
lines, and a glassy email card with a Copy button that uses the
Clipboard API; right side is a Send-a-message form with Name, Email,
Message, plus the four social bubbles in their canonical order. The
form action uses a mailto: with text/plain enctype so the user's
mail client opens with the fields pre-filled. Copy button announces
'Copied' for 1.6s then restores. Mobile collapses to a single column."
```

---

### Task 17: `initTiltGrid` + `SubpageGrid.astro` + `CardPlaceholder.astro`

**Goal:** Add `initTiltGrid` to `carousel.ts`. Build the subpage component used by the 9 category subpages: 8-card tilted grid with drag-to-pan, page dots, sister-category bubbles, and footer email strip. Lands the smaller `<CardPlaceholder>` variant.

**Files:**
- Modify: `src/scripts/carousel.ts` — add `initTiltGrid` named export
- Create: `src/components/visual/CardPlaceholder.astro`
- Create: `src/components/sections/SubpageGrid.astro`
- Modify: `src/styles/global.css` — append subpage CSS

- [ ] **Step 1: Append `initTiltGrid` to `src/scripts/carousel.ts`**

Append after the existing `initCarousel` export:

```ts
export const initTiltGrid = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const grids = (root ?? document).querySelectorAll<HTMLElement>('[data-tilt-grid]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  grids.forEach((grid) => {
    if (reduced) {
      grid.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
        card.style.setProperty('--tilt-rotate', '0deg');
      });
      return;
    }

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onPointerDown = (e: PointerEvent): void => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startScrollLeft = grid.scrollLeft;
      grid.setPointerCapture(e.pointerId);
      grid.classList.add('is-dragging');
    };

    const onPointerMove = (e: PointerEvent): void => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      grid.scrollLeft = startScrollLeft - dx;
    };

    const onPointerUp = (e: PointerEvent): void => {
      if (!dragging) return;
      dragging = false;
      try { grid.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      grid.classList.remove('is-dragging');
    };

    grid.addEventListener('pointerdown', onPointerDown);
    grid.addEventListener('pointermove', onPointerMove);
    grid.addEventListener('pointerup', onPointerUp);
    grid.addEventListener('pointercancel', onPointerUp);
  });
};
```

- [ ] **Step 2: Append subpage CSS to `src/styles/global.css`**

```css
/* ----- subpage grid (SubpageGrid.astro) ----- */

.subpage {
  padding: 8rem clamp(1.5rem, 5vw, 4.5rem) 5rem;
  min-height: 100vh;
}

.subpage-back {
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-ink-soft);
  margin-bottom: 1.5rem;
  display: inline-block;
}

.subpage-heading {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(2.75rem, 6cqw, 5rem);
  color: var(--c-ink);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.subpage-blurb {
  font-family: var(--font-body);
  color: var(--c-ink-soft);
  max-width: 56ch;
  margin-bottom: 3rem;
}

[data-tilt-grid] {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(2, auto);
  gap: 1.25rem;
  overflow-x: auto;
  padding: 1rem 0;
  user-select: none;
  scrollbar-width: none;
}

[data-tilt-grid]::-webkit-scrollbar {
  display: none;
}

[data-tilt-grid].is-dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}

.tilt-card {
  flex: 0 0 auto;
  width: clamp(220px, 30vw, 320px);
  transform: rotate(var(--tilt-rotate, 0deg));
  border-radius: var(--radius-md);
  background: var(--c-bg-elev);
  border: 1px solid var(--c-line);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  scroll-snap-align: center;
  transition: transform 240ms var(--ease-standard);
}

.tilt-card-meta {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--c-ink);
  padding: 0 0.25rem 0.25rem;
}

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

.subpage-sister-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-line);
}

.subpage-sister-bubbles a {
  padding: 0.4rem 0.875rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--c-line);
  background: var(--c-bg-elev);
  color: var(--c-ink);
  font-family: var(--font-body);
  font-size: 0.85rem;
  text-decoration: none;
}

.subpage-footer-email {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-line);
  font-family: var(--font-body);
}
```

- [ ] **Step 3: Write `src/components/visual/CardPlaceholder.astro`**

```astro
---
interface Props {
  cover: string;
  glyph?: string;
}

const { cover, glyph = '◆' } = Astro.props;

const parseHue = (uri: string): number => {
  const match = /^placeholder:hue=(\d+)$/.exec(uri);
  return match ? Number.parseInt(match[1] ?? '240', 10) : 240;
};

const hue = parseHue(cover);
const bg = `linear-gradient(135deg, oklch(78% 0.14 ${hue}) 0%, oklch(58% 0.17 ${(hue + 25) % 360}) 100%)`;
---
<div class="card-placeholder" style={`background: ${bg};`}>
  <span class="card-placeholder-glyph">{glyph}</span>
</div>

<style>
  .card-placeholder {
    aspect-ratio: 4 / 5;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card-placeholder-glyph {
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.5rem, 3.5vw, 3rem);
    color: rgba(255, 255, 255, 0.85);
  }
</style>
```

- [ ] **Step 4: Write `src/components/sections/SubpageGrid.astro`**

```astro
---
// packages
import { getCollection, type CollectionEntry } from 'astro:content';

// utils
import { localizedHref } from '../../utils/localizedHref';
import { mulberry32 } from '../../utils/mulberry32';
import { hueFromSlug, seedFromSlug } from '../../utils/slug-hash';

// components
import CardPlaceholder from '../visual/CardPlaceholder.astro';

// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  category: CollectionEntry<'categories'>;
  lang: Lang;
}

const { category, lang } = Astro.props;
const t = getT(lang);

const projects = (await getCollection('projects', ({ data }) => (
  data.kind === category.data.kind && data.category === category.data.slug
))).slice(0, 8);

const sisterCategories = await Promise.all(
  category.data.sisterCategories.map(async (slug) => {
    const all = await getCollection('categories', ({ data }) => data.slug === slug);
    return all[0];
  })
);
const sisters = sisterCategories.filter((c): c is CollectionEntry<'categories'> => Boolean(c));

const tiltFor = (slug: string): string => {
  const rng = mulberry32(seedFromSlug(slug));
  return `${(rng() * 6 - 3).toFixed(2)}deg`;
};

const kindLabel = category.data.kind === 'design' ? t('nav.design') : t('nav.artwork');
const homeHref = localizedHref(lang, '/');
const email = t('contact.email');
---
<section class="subpage">
  <a class="subpage-back" href={homeHref} data-cursor="link">← {t('subpage.back')} {kindLabel}</a>
  <h1 class="subpage-heading">{category.data.label[lang]}</h1>
  <p class="subpage-blurb">{category.data.blurb[lang]}</p>

  <div data-tilt-grid>
    {projects.map((p) => {
      const hue = hueFromSlug(p.data.slug);
      const cover = p.data.cover.startsWith('placeholder:') ? p.data.cover : `placeholder:hue=${hue}`;
      return (
        <article class="tilt-card" data-slug={p.data.slug} style={`--tilt-rotate: ${tiltFor(p.data.slug)};`}>
          <CardPlaceholder cover={cover} glyph="◆" />
          <div class="tilt-card-meta">{p.data.title[lang]}</div>
        </article>
      );
    })}
  </div>

  <div class="subpage-pagination">
    {[1, 2, 3].map((page) => (
      <button type="button" class="subpage-page-dot" aria-label={`${t('subpage.pageOf')} ${page}`} aria-current={page === 1 ? 'true' : 'false'} data-cursor="link"></button>
    ))}
  </div>

  <p style="font-family: var(--font-body); font-size: 0.75rem; letter-spacing: .12em; text-transform: uppercase; color: var(--c-ink-soft); margin-top: 4rem;">{t('subpage.relatedCategories')}</p>
  <nav class="subpage-sister-bubbles">
    {sisters.map((s) => {
      const href = s.data.kind === 'design' ? localizedHref(lang, `/design/${s.data.slug}`) : localizedHref(lang, `/artwork/${s.data.slug}`);
      return (
        <a href={href} data-cursor="link">{s.data.label[lang]}</a>
      );
    })}
  </nav>

  <div class="subpage-footer-email">
    <span>{email}</span>
    <a href={`mailto:${email}`} data-cursor="link">{t('contact.ctaCopy')}</a>
  </div>
</section>

<script>
  import { initTiltGrid } from '../../scripts/carousel';

  initTiltGrid();
</script>
```

- [ ] **Step 5: Add subpage i18n keys to `en.json` and `es.json`**

In `en.json`:
```json
"subpage": {
  "back": "Back to",
  "pageOf": "Page",
  "relatedCategories": "Related categories"
}
```

In `es.json`:
```json
"subpage": {
  "back": "Volver a",
  "pageOf": "Página",
  "relatedCategories": "Categorías relacionadas"
}
```

- [ ] **Step 6: Verify lint + typecheck + build**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: 0 errors. SubpageGrid is not yet wired to any page; Task 18 does that.

- [ ] **Step 7: Commit**

```bash
git add src/scripts/carousel.ts src/components/visual/CardPlaceholder.astro src/components/sections/SubpageGrid.astro src/styles/global.css src/i18n/en.json src/i18n/es.json
git commit -m "Add SubpageGrid component with tilt grid and sister bubbles

Carousel.ts gains initTiltGrid which wires pointerdown/move/up to
translate scrollLeft for horizontal drag-to-pan; reduced-motion users
see flat cards in a plain horizontal scroll. SubpageGrid composes the
Branding-template layout: back link, heading + blurb, 8 tilted cards
with seeded rotations, page dots, sister-category bubbles, and a
footer email strip. CardPlaceholder is the smaller cover variant
used by tilt cards."
```

---

### Task 18: Mount SubpageGrid on the four `[category].astro` pages

**Goal:** Replace the Phase-0 stub bodies of `src/pages/{design,artwork}/[category].astro` and the Spanish mirrors with `<SubpageGrid>`.

**Files:**
- Modify: `src/pages/design/[category].astro`
- Modify: `src/pages/artwork/[category].astro`
- Modify: `src/pages/es/design/[category].astro`
- Modify: `src/pages/es/artwork/[category].astro`

- [ ] **Step 1: Rewrite `src/pages/design/[category].astro`**

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../layouts/BaseLayout.astro';

// components
import SubpageGrid from '../../components/sections/SubpageGrid.astro';

// i18n
import { getT } from '../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'design');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug }: Props = Astro.props;
const lang = 'en' as const;
const t = getT(lang);
const category = await getEntry('categories', categorySlug);

if (!category) {
  throw new Error(`Missing design category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <SubpageGrid category={category} lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Repeat for `src/pages/artwork/[category].astro`**

Identical structure but `kind === 'artwork'` in `getStaticPaths`.

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../layouts/BaseLayout.astro';

// components
import SubpageGrid from '../../components/sections/SubpageGrid.astro';

// i18n
import { getT } from '../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'artwork');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug }: Props = Astro.props;
const lang = 'en' as const;
const t = getT(lang);
const category = await getEntry('categories', categorySlug);

if (!category) {
  throw new Error(`Missing artwork category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <SubpageGrid category={category} lang={lang} />
</BaseLayout>
```

- [ ] **Step 3: Spanish mirror — `src/pages/es/design/[category].astro`**

Same structure but lang `'es'` and three-deep relative imports:

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../../layouts/BaseLayout.astro';

// components
import SubpageGrid from '../../../components/sections/SubpageGrid.astro';

// i18n
import { getT } from '../../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'design');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug }: Props = Astro.props;
const lang = 'es' as const;
const t = getT(lang);
const category = await getEntry('categories', categorySlug);

if (!category) {
  throw new Error(`Missing design category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <SubpageGrid category={category} lang={lang} />
</BaseLayout>
```

- [ ] **Step 4: Spanish mirror — `src/pages/es/artwork/[category].astro`**

Same as Step 2 but with three-deep imports and `lang = 'es' as const`:

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../../layouts/BaseLayout.astro';

// components
import SubpageGrid from '../../../components/sections/SubpageGrid.astro';

// i18n
import { getT } from '../../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'artwork');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug }: Props = Astro.props;
const lang = 'es' as const;
const t = getT(lang);
const category = await getEntry('categories', categorySlug);

if (!category) {
  throw new Error(`Missing artwork category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <SubpageGrid category={category} lang={lang} />
</BaseLayout>
```

- [ ] **Step 5: Verify build still produces 20 routes**

```bash
npm run lint && npm run typecheck && npm run build
find dist -name 'index.html' | wc -l
```

Expected: 20.

- [ ] **Step 6: Commit**

```bash
git add src/pages/design/[category].astro src/pages/artwork/[category].astro src/pages/es/design/[category].astro src/pages/es/artwork/[category].astro
git commit -m "Replace [category].astro stubs with SubpageGrid mount

The four dynamic-route files now render the Branding-template
SubpageGrid for the looked-up category. Each file's getStaticPaths
behavior is unchanged from Phase 0; only the body swaps the stub
text for the SubpageGrid component."
```

---

### Task 19: Audit i18n parity + finalize all string keys

**Goal:** Phase 1 added 22+ strings across multiple commits. Verify both `en.json` and `es.json` carry every key, with no orphans on either side. Run a parity script that walks both trees.

**Files:**
- Read: `src/i18n/en.json`
- Read: `src/i18n/es.json`

- [ ] **Step 1: Run a parity diff**

```bash
node -e "
  const en = require('./src/i18n/en.json');
  const es = require('./src/i18n/es.json');
  const flatten = (obj, prefix='') => Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null && !Array.isArray(v)
      ? flatten(v, prefix + k + '.')
      : [prefix + k]
  );
  const a = flatten(en).sort();
  const b = flatten(es).sort();
  const missing = a.filter(k => !b.includes(k));
  const extra = b.filter(k => !a.includes(k));
  console.log('en total:', a.length, '/ es total:', b.length);
  console.log('missing in es:', missing);
  console.log('extra in es:', extra);
"
```

Expected: both lengths equal; `missing in es: []`; `extra in es: []`.

- [ ] **Step 2: If missing or extra keys are reported, fix them**

Add the missing keys to whichever file lacks them, removing duplicates if any. Re-run Step 1 until both arrays are empty.

- [ ] **Step 3: Run a build to confirm `getT.resolve` doesn't throw**

```bash
npm run build
```

Expected: 0 errors. The runtime guard would throw `i18n: missing key "..."` if any page renders a key absent from either dictionary.

- [ ] **Step 4: Commit only if Step 2 made changes**

If Step 1 reported all empty arrays on first run, no commit is needed for this task — Tasks 11/12/13/16/17 already covered the strings. Otherwise:

```bash
git add src/i18n/en.json src/i18n/es.json
git commit -m "Reconcile EN/ES i18n key trees for Phase 1

A handful of keys drifted between en.json and es.json across the
Phase 1 component commits. The parity audit identified the gaps and
this commit restores 1:1 coverage so getT.resolve never throws at
build time."
```

---

### Task 20: README updates and motion smoke checklist

**Goal:** README gains a Phase 1 section listing what shipped, plus the manual smoke checklist used for §7 of the spec's exit criteria.

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Append a Phase 1 section to `README.md`**

After the existing Stack table and before the Contributing section, insert:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Document Phase 1 highlights and motion smoke checklist

README gains a Phase 1 section summarizing what shipped (hero,
sections, subpages, contact, motion stack, 72 placeholders, i18n)
and a 12-item manual smoke checklist that maps to the spec's §7
exit-criteria item 6. Reviewers run the checklist on each rebase
or push."
```

---

### Task 21: `seed-placeholders.mjs` — generate 72 placeholder project JSONs

**Goal:** A Node ES-module script at `scripts/seed-placeholders.mjs` that writes 8 placeholder project JSONs per category. Idempotent: re-running overwrites the same files. Run it once, commit the 72 generated JSONs (plus the script itself) as a single commit.

**Files:**
- Create: `scripts/seed-placeholders.mjs`
- Generates: 72 JSONs under `src/content/projects/<kind>/<category>/<NN>-<slug>.json`

- [ ] **Step 1: Write `scripts/seed-placeholders.mjs`**

```js
// scripts/seed-placeholders.mjs
//
// Generates 8 placeholder project JSONs per category (9 categories × 8 = 72).
// Idempotent: rerun safely; existing 2 Phase-0 stubs (sample.json) are preserved.

// packages
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const contentRoot = join(repoRoot, 'src/content/projects');

// Per-category placeholder slug pools. 8 items each.
const POOLS = {
  'design/branding': [
    { slug: 'aurora-studio',     en: 'Aurora Studio',          es: 'Aurora Studio',           subEn: 'Identity for a residency',          subEs: 'Identidad para una residencia',           role: 'Designer', sectors: ['culture', 'residency'], year: 2025 },
    { slug: 'florería-núcleo',   en: 'Florería Núcleo',        es: 'Florería Núcleo',         subEn: 'Local florist rebrand',             subEs: 'Rediseño para una florería local',        role: 'Designer', sectors: ['retail', 'lifestyle'], year: 2024 },
    { slug: 'maris-coffee',      en: 'Maris Coffee',           es: 'Café Maris',              subEn: 'Specialty coffee brand',            subEs: 'Marca de café de especialidad',           role: 'Designer', sectors: ['food', 'hospitality'], year: 2024 },
    { slug: 'paloma-ceramics',   en: 'Paloma Ceramics',        es: 'Cerámica Paloma',         subEn: 'Studio identity & packaging',       subEs: 'Identidad y empaque del estudio',         role: 'Designer', sectors: ['craft', 'product'], year: 2025 },
    { slug: 'cardumen',          en: 'Cardumen',               es: 'Cardumen',                subEn: 'Editorial collective brand',         subEs: 'Marca de colectivo editorial',            role: 'Designer', sectors: ['publishing', 'culture'], year: 2025 },
    { slug: 'verbena',           en: 'Verbena',                es: 'Verbena',                 subEn: 'Wellness brand identity',           subEs: 'Identidad de marca de bienestar',         role: 'Designer', sectors: ['wellness', 'lifestyle'], year: 2024 },
    { slug: 'ojo-de-agua',       en: 'Ojo de Agua',            es: 'Ojo de Agua',             subEn: 'Sustainable water bottling',         subEs: 'Embotellado de agua sostenible',          role: 'Designer', sectors: ['sustainability', 'product'], year: 2025 },
    { slug: 'volcan-records',    en: 'Volcán Records',         es: 'Volcán Records',          subEn: 'Independent label identity',         subEs: 'Identidad de sello independiente',        role: 'Designer', sectors: ['music', 'culture'], year: 2024 },
  ],
  'design/social-media': [
    { slug: 'fest-2025',         en: 'Fest 2025',              es: 'Fest 2025',               subEn: 'Festival campaign templates',        subEs: 'Plantillas de campaña de festival',       role: 'Designer', sectors: ['events', 'culture'], year: 2025 },
    { slug: 'la-feria',          en: 'La Feria',               es: 'La Feria',                subEn: 'Weekly market posts',                subEs: 'Posts semanales de mercado',              role: 'Designer', sectors: ['retail', 'community'], year: 2024 },
    { slug: 'voces-digitales',   en: 'Voces Digitales',        es: 'Voces Digitales',         subEn: 'Podcast launch series',              subEs: 'Serie de lanzamiento de podcast',         role: 'Designer', sectors: ['media', 'culture'], year: 2025 },
    { slug: 'reels-fall',        en: 'Reels: Fall',            es: 'Reels: Otoño',            subEn: 'Seasonal short-form content',        subEs: 'Contenido corto de temporada',            role: 'Designer', sectors: ['fashion', 'social'], year: 2024 },
    { slug: 'studio-thread',     en: 'Studio Thread',          es: 'Studio Thread',           subEn: 'Process documentation series',       subEs: 'Serie de documentación de proceso',       role: 'Designer', sectors: ['behind-the-scenes', 'culture'], year: 2025 },
    { slug: 'fragmentos',        en: 'Fragmentos',             es: 'Fragmentos',              subEn: 'Editorial micro-stories',            subEs: 'Micro-historias editoriales',             role: 'Designer', sectors: ['publishing', 'social'], year: 2024 },
    { slug: 'open-call-25',      en: 'Open Call 2025',         es: 'Convocatoria 2025',       subEn: 'Submission campaign suite',          subEs: 'Suite de campaña de envío',               role: 'Designer', sectors: ['culture', 'events'], year: 2025 },
    { slug: 'caja-digital',      en: 'Caja Digital',           es: 'Caja Digital',            subEn: 'Boxed Reels series',                 subEs: 'Serie de Reels en formato caja',          role: 'Designer', sectors: ['social', 'experiments'], year: 2024 },
  ],
  'design/ai-designs': [
    { slug: 'liminal',           en: 'Liminal',                es: 'Liminal',                 subEn: 'AI-assisted editorial covers',       subEs: 'Portadas editoriales asistidas por IA',   role: 'Art Director', sectors: ['publishing', 'experimental'], year: 2025 },
    { slug: 'estatura',          en: 'Estatura',               es: 'Estatura',                subEn: 'Generative campaign keyframes',       subEs: 'Keyframes generativos de campaña',        role: 'Art Director', sectors: ['advertising', 'experimental'], year: 2025 },
    { slug: 'eco-portrait',      en: 'Eco Portrait',           es: 'Eco Retrato',             subEn: 'AI portraiture commission',          subEs: 'Encargo de retrato con IA',               role: 'Art Director', sectors: ['portraiture', 'experimental'], year: 2024 },
    { slug: 'campos',            en: 'Campos',                 es: 'Campos',                  subEn: 'Generative landscape series',         subEs: 'Serie generativa de paisajes',            role: 'Art Director', sectors: ['landscape', 'experimental'], year: 2025 },
    { slug: 'velo',              en: 'Velo',                   es: 'Velo',                    subEn: 'Editorial photography retouch',      subEs: 'Retoque fotográfico editorial',           role: 'Image Editor', sectors: ['publishing'], year: 2024 },
    { slug: 'puente',            en: 'Puente',                 es: 'Puente',                  subEn: 'Hybrid AI + photo work',             subEs: 'Trabajo híbrido IA + foto',               role: 'Art Director', sectors: ['hybrid', 'experimental'], year: 2025 },
    { slug: 'noche-larga',       en: 'Long Night',             es: 'Noche Larga',             subEn: 'Album artwork generation',           subEs: 'Generación de portada de álbum',          role: 'Art Director', sectors: ['music'], year: 2024 },
    { slug: 'estanque',          en: 'Estanque',               es: 'Estanque',                subEn: 'Brand story keyframes',              subEs: 'Keyframes de relato de marca',            role: 'Art Director', sectors: ['advertising'], year: 2025 },
  ],
  'design/print': [
    { slug: 'almanaque-2025',    en: 'Almanaque 2025',         es: 'Almanaque 2025',          subEn: 'Yearly almanac design',              subEs: 'Diseño de almanaque anual',               role: 'Designer', sectors: ['publishing'], year: 2025 },
    { slug: 'casa-libro',        en: 'Casa Libro',             es: 'Casa Libro',              subEn: 'Independent press identity',          subEs: 'Identidad de editorial independiente',    role: 'Designer', sectors: ['publishing'], year: 2024 },
    { slug: 'menu-fonda',        en: 'Fonda Menu',             es: 'Menú Fonda',              subEn: 'Restaurant menu system',             subEs: 'Sistema de menús de restaurante',         role: 'Designer', sectors: ['food'], year: 2024 },
    { slug: 'poster-veladas',    en: 'Veladas Poster',         es: 'Cartel Veladas',          subEn: 'Concert poster series',              subEs: 'Serie de carteles de concierto',          role: 'Designer', sectors: ['music', 'culture'], year: 2025 },
    { slug: 'memoria',           en: 'Memoria',                es: 'Memoria',                 subEn: 'Annual report layout',               subEs: 'Maquetación de informe anual',            role: 'Designer', sectors: ['institutional'], year: 2025 },
    { slug: 'mar-libro',         en: 'Mar Libro',              es: 'Mar Libro',               subEn: 'Photo book design',                  subEs: 'Diseño de fotolibro',                     role: 'Designer', sectors: ['publishing', 'photography'], year: 2024 },
    { slug: 'ediciones-pera',    en: 'Ediciones Pera',         es: 'Ediciones Pera',          subEn: 'Catalog series',                     subEs: 'Serie de catálogos',                      role: 'Designer', sectors: ['publishing'], year: 2024 },
    { slug: 'taller-papel',      en: 'Taller Papel',           es: 'Taller Papel',            subEn: 'Workshop printed collateral',         subEs: 'Material impreso de taller',              role: 'Designer', sectors: ['craft', 'culture'], year: 2025 },
  ],
  'design/illustration': [
    { slug: 'siesta',            en: 'Siesta',                 es: 'Siesta',                  subEn: 'Editorial illustration series',      subEs: 'Serie de ilustración editorial',          role: 'Illustrator', sectors: ['editorial'], year: 2024 },
    { slug: 'arroyo',            en: 'Arroyo',                 es: 'Arroyo',                  subEn: 'Children’s book illustrations',  subEs: 'Ilustraciones para libro infantil',       role: 'Illustrator', sectors: ['publishing', 'children'], year: 2025 },
    { slug: 'fauna',              en: 'Fauna',                  es: 'Fauna',                   subEn: 'Field guide illustrations',          subEs: 'Ilustraciones para guía de campo',         role: 'Illustrator', sectors: ['publishing', 'science'], year: 2024 },
    { slug: 'recetario',         en: 'Recetario',              es: 'Recetario',               subEn: 'Cookbook illustration set',           subEs: 'Set de ilustración para recetario',       role: 'Illustrator', sectors: ['publishing', 'food'], year: 2025 },
    { slug: 'cuentos-luna',      en: 'Cuentos Luna',           es: 'Cuentos Luna',            subEn: 'Bedtime story art direction',        subEs: 'Dirección de arte para cuentos',          role: 'Illustrator', sectors: ['publishing', 'children'], year: 2024 },
    { slug: 'dorso',             en: 'Dorso',                  es: 'Dorso',                   subEn: 'Magazine spread illustrations',       subEs: 'Ilustraciones para revista',              role: 'Illustrator', sectors: ['editorial'], year: 2025 },
    { slug: 'vendaval',          en: 'Vendaval',               es: 'Vendaval',                subEn: 'Album cover illustration',           subEs: 'Ilustración de portada de álbum',         role: 'Illustrator', sectors: ['music'], year: 2024 },
    { slug: 'pájaros-rotos',     en: 'Broken Birds',           es: 'Pájaros Rotos',           subEn: 'Personal illustration series',        subEs: 'Serie de ilustración personal',           role: 'Illustrator', sectors: ['personal'], year: 2025 },
  ],
  'design/ui-design': [
    { slug: 'lectura',           en: 'Lectura',                es: 'Lectura',                 subEn: 'Reading app interface',              subEs: 'Interfaz de app de lectura',              role: 'Designer', sectors: ['app', 'reading'], year: 2025 },
    { slug: 'maps-eco',          en: 'Maps Eco',               es: 'Maps Eco',                subEn: 'Sustainable maps redesign',          subEs: 'Rediseño de mapas sostenibles',           role: 'Designer', sectors: ['app', 'sustainability'], year: 2024 },
    { slug: 'studio-portal',     en: 'Studio Portal',          es: 'Studio Portal',           subEn: 'Creative-studio extranet',            subEs: 'Extranet de estudio creativo',            role: 'Designer', sectors: ['web', 'b2b'], year: 2025 },
    { slug: 'agenda',            en: 'Agenda',                 es: 'Agenda',                  subEn: 'Personal scheduling redesign',        subEs: 'Rediseño de agenda personal',             role: 'Designer', sectors: ['app', 'productivity'], year: 2024 },
    { slug: 'librería-mar',      en: 'Librería Mar',           es: 'Librería Mar',            subEn: 'Indie bookshop e-commerce',          subEs: 'E-commerce de librería indie',            role: 'Designer', sectors: ['web', 'retail'], year: 2025 },
    { slug: 'foro-abierto',      en: 'Open Forum',             es: 'Foro Abierto',            subEn: 'Community forum design',             subEs: 'Diseño de foro comunitario',              role: 'Designer', sectors: ['web', 'community'], year: 2024 },
    { slug: 'archivo',           en: 'Archivo',                es: 'Archivo',                 subEn: 'Personal archive interface',          subEs: 'Interfaz de archivo personal',            role: 'Designer', sectors: ['app', 'personal'], year: 2025 },
    { slug: 'galería-tres',      en: 'Galería Tres',           es: 'Galería Tres',            subEn: 'Gallery website',                    subEs: 'Sitio web de galería',                    role: 'Designer', sectors: ['web', 'culture'], year: 2024 },
  ],
  'artwork/drawing': [
    { slug: 'cuaderno-azul',     en: 'Blue Notebook',          es: 'Cuaderno Azul',           subEn: 'Daily ink studies',                  subEs: 'Estudios diarios a tinta',                role: 'Artist', sectors: ['ink', 'study'], year: 2025 },
    { slug: 'manos',             en: 'Hands',                  es: 'Manos',                   subEn: 'Pencil portrait series',             subEs: 'Serie de retratos a lápiz',               role: 'Artist', sectors: ['portrait'], year: 2024 },
    { slug: 'naufragio',         en: 'Naufragio',              es: 'Naufragio',               subEn: 'Mixed-media seascapes',              subEs: 'Marinas en técnica mixta',                role: 'Artist', sectors: ['mixed-media'], year: 2025 },
    { slug: 'sombras',           en: 'Sombras',                es: 'Sombras',                 subEn: 'Charcoal interior studies',          subEs: 'Estudios de interiores a carbón',         role: 'Artist', sectors: ['charcoal', 'interior'], year: 2024 },
    { slug: 'flora-personal',    en: 'Personal Flora',         es: 'Flora Personal',          subEn: 'Botanical pencil sketches',           subEs: 'Bocetos botánicos a lápiz',               role: 'Artist', sectors: ['botanical'], year: 2025 },
    { slug: 'sin-titulo-7',      en: 'Untitled No. 7',         es: 'Sin Título No. 7',        subEn: 'Abstract gesture drawings',           subEs: 'Dibujos gestuales abstractos',            role: 'Artist', sectors: ['abstract'], year: 2024 },
    { slug: 'ventanas',          en: 'Ventanas',               es: 'Ventanas',                subEn: 'Window-light pencil studies',         subEs: 'Estudios de luz de ventana a lápiz',      role: 'Artist', sectors: ['study'], year: 2025 },
    { slug: 'mapa',              en: 'Mapa',                   es: 'Mapa',                    subEn: 'Imaginary cartography',              subEs: 'Cartografía imaginaria',                  role: 'Artist', sectors: ['cartography'], year: 2024 },
  ],
  'artwork/painting': [
    { slug: 'azul-tarde',        en: 'Tarde Azul',             es: 'Tarde Azul',              subEn: 'Watercolor afternoons',              subEs: 'Tardes en acuarela',                      role: 'Artist', sectors: ['watercolor'], year: 2025 },
    { slug: 'arboleda',          en: 'Arboleda',               es: 'Arboleda',                subEn: 'Acrylic forest series',              subEs: 'Serie de bosques en acrílico',            role: 'Artist', sectors: ['acrylic', 'landscape'], year: 2024 },
    { slug: 'patio',             en: 'Patio',                  es: 'Patio',                   subEn: 'Domestic interior paintings',         subEs: 'Pinturas de interiores domésticos',       role: 'Artist', sectors: ['interior'], year: 2025 },
    { slug: 'mar-adentro',       en: 'Mar Adentro',            es: 'Mar Adentro',             subEn: 'Seascape oils',                       subEs: 'Marinas en óleo',                          role: 'Artist', sectors: ['oil', 'seascape'], year: 2025 },
    { slug: 'pomelo',            en: 'Pomelo',                 es: 'Pomelo',                  subEn: 'Still-life pomelo studies',          subEs: 'Naturalezas muertas con pomelo',          role: 'Artist', sectors: ['still-life'], year: 2024 },
    { slug: 'caminos',           en: 'Caminos',                es: 'Caminos',                 subEn: 'Landscape oil series',               subEs: 'Serie de paisajes en óleo',               role: 'Artist', sectors: ['oil', 'landscape'], year: 2025 },
    { slug: 'puerta-amarilla',   en: 'Yellow Door',            es: 'Puerta Amarilla',         subEn: 'Architectural fragments',             subEs: 'Fragmentos arquitectónicos',              role: 'Artist', sectors: ['architecture'], year: 2024 },
    { slug: 'sin-fin',           en: 'Sin Fin',                es: 'Sin Fin',                 subEn: 'Abstract acrylic series',            subEs: 'Serie abstracta en acrílico',             role: 'Artist', sectors: ['abstract'], year: 2025 },
  ],
  'artwork/photography': [
    { slug: 'verano-largo',      en: 'Long Summer',            es: 'Verano Largo',            subEn: 'Summer travel notes',                subEs: 'Notas de viaje de verano',                role: 'Photographer', sectors: ['travel'], year: 2024 },
    { slug: 'cocina',            en: 'Cocina',                 es: 'Cocina',                  subEn: 'Quiet kitchen still-lifes',          subEs: 'Naturalezas muertas tranquilas de cocina', role: 'Photographer', sectors: ['still-life', 'domestic'], year: 2025 },
    { slug: 'callejón',          en: 'Callejón',               es: 'Callejón',                subEn: 'Street photography in CDMX',          subEs: 'Fotografía de calle en CDMX',             role: 'Photographer', sectors: ['street'], year: 2025 },
    { slug: 'manualidades',      en: 'Manualidades',           es: 'Manualidades',            subEn: 'Studio process documentation',        subEs: 'Documentación de proceso en estudio',      role: 'Photographer', sectors: ['process'], year: 2024 },
    { slug: 'olas',              en: 'Olas',                   es: 'Olas',                    subEn: 'Ocean studies',                       subEs: 'Estudios oceánicos',                      role: 'Photographer', sectors: ['nature'], year: 2024 },
    { slug: 'familiar',          en: 'Familiar',               es: 'Familiar',                subEn: 'Portrait of close friends',          subEs: 'Retrato de amistades cercanas',           role: 'Photographer', sectors: ['portrait'], year: 2025 },
    { slug: 'tianguis',          en: 'Tianguis',               es: 'Tianguis',                subEn: 'Open-market photo essay',             subEs: 'Ensayo fotográfico de tianguis',          role: 'Photographer', sectors: ['documentary'], year: 2024 },
    { slug: 'reflejos',          en: 'Reflejos',               es: 'Reflejos',                subEn: 'Reflective surfaces series',          subEs: 'Serie de superficies reflectantes',       role: 'Photographer', sectors: ['abstract', 'experimental'], year: 2025 },
  ],
};

const stringHash = (s) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};
const hueFromSlug = (slug) => 200 + (stringHash(slug) % 121);

let written = 0;
let skipped = 0;

for (const [path, items] of Object.entries(POOLS)) {
  const [kind, category] = path.split('/');
  const dir = join(contentRoot, kind, category);
  mkdirSync(dir, { recursive: true });
  items.forEach((item, i) => {
    const seq = String(i + 1).padStart(2, '0');
    const filename = `${seq}-${item.slug}.json`;
    const filepath = join(dir, filename);
    if (existsSync(filepath)) {
      skipped += 1;
      return;
    }
    const hue = hueFromSlug(item.slug);
    const json = {
      slug: item.slug,
      kind,
      category,
      title: { en: item.en, es: item.es },
      subtitle: { en: item.subEn, es: item.subEs },
      studio: 'Independent',
      role: { en: item.role, es: item.role },
      sectors: item.sectors,
      year: item.year,
      cover: `placeholder:hue=${hue}`,
      gallery: [],
    };
    writeFileSync(filepath, JSON.stringify(json, null, 2) + '\n');
    written += 1;
  });
}

console.log(`Wrote ${written} placeholder JSONs (${skipped} already existed and were left alone).`);
```

- [ ] **Step 2: Run the script**

```bash
node scripts/seed-placeholders.mjs
```

Expected output: `Wrote 72 placeholder JSONs (...)` (the 2 Phase-0 stubs may already exist with the same `sample` slugs but in different paths — they shouldn't collide).

- [ ] **Step 3: Verify the count**

```bash
find src/content/projects -name '*.json' | wc -l
```

Expected: 74 (72 new + 2 Phase-0 stubs `sample.json`).

- [ ] **Step 4: Verify the build still passes content schema validation**

```bash
npm run typecheck
```

Expected: `astro check` reports `Result (N files): 0 errors`. The 72 new JSONs all conform to the zod schema.

- [ ] **Step 5: Visual smoke — confirm the homepage carousels are now populated**

```bash
npm run build
grep -oE 'data-slug="[^"]+"' dist/index.html | sort -u | wc -l
```

Expected: ≥ 8 (the active design category renders 8 cards in the carousel by default).

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-placeholders.mjs src/content/projects/
git commit -m "Seed 72 placeholder project entries across 9 categories

scripts/seed-placeholders.mjs is an idempotent Node script that writes
8 placeholder JSONs per category. Slugs are deterministic so reruns
produce identical files; existing files are not overwritten so the
Phase-0 stub samples remain untouched. Each entry conforms to the
content.config.ts schema with bilingual title/subtitle/role, a
'placeholder:hue=NNN' cover URI keyed off slug-hash, and an empty
gallery array ready for Carolina's real images."
```

---

### Task 22: Final verification + push + open PR

This task produces no commit. Its job is to confirm the spec's §7 exit criteria.

- [ ] **Step 1: Clean install**

```bash
rm -rf node_modules dist .astro
npm ci
```

- [ ] **Step 2: Full check suite**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: all 0 errors. Build emits 20 routes.

- [ ] **Step 3: Confirm 20 routes**

```bash
find dist -name 'index.html' | wc -l
```

Expected: 20.

- [ ] **Step 4: Confirm motion markup ships on every page**

```bash
for p in dist/index.html dist/es/index.html dist/design/branding/index.html dist/es/artwork/painting/index.html; do
  echo "--- $p ---"
  grep -ocE 'data-jellyfish-stage|data-bubble-selector|data-marquee|data-tilt-grid|data-reveal' "$p"
done
```

Expected: home pages show all of `data-jellyfish-stage`, `data-bubble-selector`, `data-marquee`, `data-reveal` — counts > 0. Subpages show `data-tilt-grid`, `data-reveal`.

- [ ] **Step 5: Lighthouse smoke (manual)**

```bash
npm run dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
sleep 5
echo "Open http://localhost:4321/portfolio-web-app-ciruela/ in Chrome and run Lighthouse."
echo "Press enter when done."
read
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null
```

Expected: 90 perf / 95 a11y / 95 best-practices. If perf < 90, follow the spec's §9 mitigation: drop sparkles + reduce drift work.

- [ ] **Step 6: Manual smoke checklist (run the 12 items in README §"Manual smoke checklist")**

If any item fails, fix it (separate commit) and re-run from Step 1.

- [ ] **Step 7: Push branch**

```bash
git push -u origin feature/phase-1-design
```

- [ ] **Step 8: Open the PR**

```bash
gh pr create \
  --title "Phase 1 — full visual + motion design" \
  --body "$(cat <<'EOF'
## Summary

Phase 1 ships the complete visual + motion design as a single mega-PR stacked on top of Phase 0 (#1). After this lands, the only thing missing for launch is Carolina's real project data and photographs.

- Three-layer architecture: motion primitives (vanilla TS), visual primitives (Astro), section components.
- All 7 motion items: custom morphing cursor, paint splash, marquee, scroll reveals, jellyfish drift + parallax, sparkles, tilted-grid drag. All disable on `prefers-reduced-motion`; cursor also disables on `pointer: coarse`.
- Hero: three SVG jellyfish (build-time tendril paths) + sparkles + Carolina Rivera wordmark.
- Two PortfolioSections (Design + Artwork) with bubble selector + glassy carousel + meta strip wired by a two-event loop (`bubble:change`, `carousel:active`).
- Contact section restructured per `Ref Contact`. Mailto-only form. Four social bubbles.
- 9 category subpages built from the Branding template (8 tilted draggable cards + sister bubbles + page dots).
- 72 placeholder project entries generated by `scripts/seed-placeholders.mjs`.
- EN and ES parity for every UI string.

## Test plan

- [x] `npm ci && npm run lint && npm run typecheck && npm run build` all green
- [x] 20 routes generate
- [x] All motion markup ships in HTML (jellyfish, bubble selector, marquee, tilt grid, reveals)
- [ ] Lighthouse on `/`: ≥ 90 perf / ≥ 95 a11y / ≥ 95 best-practices
- [ ] Manual smoke checklist (README §Phase 1) passes for all 12 items
- [ ] Reduced-motion smoke: motion items freeze/disable as documented
- [ ] Touch device smoke: cursor disables, other motion runs

## References

- Spec: `docs/superpowers/specs/2026-05-08-phase-1-mega-design.md`
- Plan: `docs/superpowers/plans/2026-05-08-phase-1-mega-design.md`
- Stacked on Phase 0 PR #1.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

If `gh pr create` errors with auth or network, capture the message and report. Don't try to authenticate.

---

## Self-review

**Spec coverage** — every in-scope item from the spec maps to a task:

| Spec section/requirement | Task(s) |
|---|---|
| §2 Layer A — `cursor.ts` | 2 |
| §2 Layer A — `splash.ts` | 3 |
| §2 Layer A — `reveal.ts` | 4 |
| §2 Layer A — `marquee.ts` | 5 |
| §2 Layer A — `jellyfish-drift.ts` | 8 |
| §2 Layer A — `carousel.ts` (`initCarousel`, `initTiltGrid`) | 12, 17 |
| §2 Layer A — `bubble-selector.ts` | 13 |
| §2 Layer B — `Jellyfish.astro` | 7 |
| §2 Layer B — `Sparkles.astro` | 9 |
| §2 Layer B — `Placeholder.astro` | 10 |
| §2 Layer B — `CardPlaceholder.astro` | 17 |
| §2 Layer B — `Marquee.astro` | 5 |
| §2 Layer C — `Hero.astro` | 11 |
| §2 Layer C — `Showcase.astro` | 12 |
| §2 Layer C — `PortfolioSection.astro` | 13 |
| §2 Layer C — `Contact.astro` | 16 |
| §2 Layer C — `SubpageGrid.astro` | 17 |
| §3.1 — pages restructured (home pages, [category] pages × 4 locales) | 14, 16, 18 |
| §3.2 — 72 placeholder project entries | 21 |
| §3.3 — i18n surface additions | 11, 12, 13, 16, 17, 19 |
| §4 — motion details | 2–13, 17 |
| §5 — accessibility | 1 (CSS), 2–13, 17 (per-component) |
| §6 — performance | 1, 22 |
| §7 — exit criteria | 22 |

**Out-of-scope guardrails confirmed** — no task adds: real photographs, real project content, sitemap, robots.txt, OG/Twitter meta, analytics, custom domain, Tweaks panel, contact form backend, or Three.js. Confirmed clean.

**Placeholder scan** — no `TBD` / `TODO` / "implement later" / "similar to Task N" anywhere. The spec-permitted placeholder Carolina email (`hello@carolinariverart.com`) is documented as such in §3.3 of the spec and lands in the i18n key in Task 16.

**Type and naming consistency** —
- `Lang = 'en' | 'es'` defined in `src/i18n/getT.ts`; consumed via `import type` in every Astro frontmatter that needs it (Tasks 5, 11, 12, 13, 16, 17, 18) and duplicated intentionally in `src/scripts/lang.ts` (already there from Phase 0).
- `CarouselActiveDetail` type exported from `src/scripts/carousel.ts` (Task 12), imported by `src/scripts/bubble-selector.ts` (Task 13).
- Event names locked: `carousel:active` (dispatched in Task 12, listened in Task 13), `bubble:change` (dispatched in Task 13).
- Data attributes locked: `data-cursor`, `data-reveal`, `data-reveal-mask`, `data-reveal-delay`, `data-marquee`, `data-marquee-track`, `data-marquee-item`, `data-jellyfish-stage`, `data-carousel`, `data-carousel-arrow`, `data-active`, `data-active-index`, `data-slug`, `data-category`, `data-showcase`, `data-bubble-selector`, `data-meta-strip`, `data-meta`, `data-projects`, `data-tilt-grid`, `data-cursor-label`, `data-copy-target`, `data-copied-label`. All consistent across the tasks that introduce and consume them.
- File paths consistent: `src/scripts/`, `src/components/visual/`, `src/components/sections/`, `src/utils/`, `scripts/` (root for Node-only).
- Commit subjects uniformly use Jericho approved verbs (`Add`, `Replace`, `Wire`, `Document`, `Reconcile`, `Seed`).

**Branch + commit policy reminder** — every commit on `feature/phase-1-design` omits `Co-Authored-By` per the project memory rule. All commits are GPG-signed. Husky hooks active (commit-msg + lint-staged pre-commit).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-08-phase-1-mega-design.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Tell me which approach you prefer.
