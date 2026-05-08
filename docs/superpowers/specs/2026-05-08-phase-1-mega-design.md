# Phase 1 — Mega-design

**Project:** `portfolio-web-app-ciruela` (Carolina M. Rivera / "Puddin's" web portfolio)
**Status:** Approved 2026-05-08
**Author:** Jose Ríos
**Implementation phase:** 1 of 1 (single mega-phase covering all visual + motion design)
**Branch:** `feature/phase-1-design` (branched from `feature/phase-0-scaffold`; targets `main`)
**Stacks on:** Phase 0 PR `#1` (still open at spec time; Phase 1 PR shows combined diff until Phase 0 merges)

---

## 1. Overview

This spec covers the **entire visual and motion design** of the portfolio. After Phase 1 ships, the only thing missing for launch is Carolina's real project data and photographs. Everything visible — hero with jellyfish, design portfolio with bubble selector and glassy carousel, artwork portfolio with the same pattern, contact section restructured per the `Ref Contact` sketch, and 9 category subpages built from the `Ref Subpage` Branding template — is in place. All seven motion items from the prototype (custom cursor, paint splash, marquee, scroll reveals, tilted draggable cards, sparkles, jellyfish drift) ship with `prefers-reduced-motion` and touch-device fallbacks. EN/ES parity for every UI string.

The visual fidelity target is **best-effort match to `dreamy.jsx`**: the prototype is the source of truth for layout, color, typography, motion choices, and section structure, but where the prototype uses React state we substitute idiomatic Astro patterns (data attributes + island scripts). Visually equivalent at the user level; structurally cleaner in our stack.

**Scope locked-in during brainstorming (non-negotiable for this spec):**
- Single mega-phase (not decomposed further)
- Stacked on Phase 0 (PR #1 stays open)
- Placeholder content (Carolina swaps real projects/photos later)
- Best-effort fidelity to `dreamy.jsx`
- All 7 motion items
- Full ES parity for UI strings; placeholder ES for project content
- Lighthouse 90 perf / 95 a11y / 95 best-practices on `/`, no bundle cap
- Inside-out build order: primitives first, then sections

**Constants carried forward from project memory** (do **not** re-litigate):
- Accent `#7A8FF7` periwinkle, used sparingly. Light ink `#34363f`. Light bg `#f4f6fc`. Dark bg `#0c0e1c`.
- Carolina wordmark: Jost weight 500 ("Carolina") + Fraunces italic 300 ("Rivera"), `~9cqw` clamped to 124px max.
- Contact socials in canonical order: Behance · Instagram · LinkedIn · WhatsApp.
- Hero jellyfish: simple SVG illustration, **not** Three.js. Carolina explicitly rejected the 3D version twice in chat.
- Tweaks panel: **not** shipped (Claude Design debug artifact).
- Real photographs require EXIF/IPTC/XMP strip before commit (rule binds the moment a real photo lands; this phase ships only placeholder OKLCH gradients, so the rule does not bind here).

---

## 2. Architecture — three layers

Decomposed strictly inside-out so each unit has one responsibility and a clear interface.

### Layer A — Motion primitives (vanilla TS modules)

Located at `src/scripts/<name>.ts`. Each is a hydration function that takes a root element (or `document`) and wires behavior. No framework dependency.

| File | Public export | Responsibility |
|---|---|---|
| `cursor.ts` | `initCursor()` | Global pointer-move listener, dot+ring DOM mutation, hover-state morph driven by `[data-cursor]` attribute on hover targets. Auto-disables on `pointer: coarse` and `prefers-reduced-motion`. |
| `splash.ts` | `initSplash(accent: string)` | Global click listener. Spawns 8 colored drops at click point in accent + 4 derived hues, fly outward via CSS keyframe, GC after `animationend`. Auto-disables on `prefers-reduced-motion`. |
| `reveal.ts` | `initReveal()` | One IntersectionObserver. Toggles `data-revealed="true"` on `[data-reveal]` when ≥30% visible. Auto-revealed when `prefers-reduced-motion`. |
| `marquee.ts` | `initMarquee(root: HTMLElement)` | Hydrates `[data-marquee]` containers with the doubled-track infinite-scroll pattern (CSS `transform: translateX` keyframe; we just clone the items). Pauses on `prefers-reduced-motion`. |
| `jellyfish-drift.ts` | `initJellyfishDrift(root: HTMLElement)` | Independent translate3d/rotate animation per child jellyfish + scroll-fade parallax via a single `requestAnimationFrame` loop. Idle when out of viewport. Disabled by `prefers-reduced-motion`. |
| `carousel.ts` | `initCarousel(root: HTMLElement)`, `initTiltGrid(root: HTMLElement)` | Two named exports sharing scroll/drag plumbing. `initCarousel` hydrates `[data-carousel]` scroll-snap tracks: computes active index (closest card to viewport center), dispatches `carousel:active` `CustomEvent` with `{ index, slug }`, supports arrow-button + keyboard nav. `initTiltGrid` hydrates `[data-tilt-grid]` for the subpage 8-card grid: applies build-time-baked `--tilt-rotate` per card, drag-to-pan via pointer events. |
| `bubble-selector.ts` | `initBubbleSelector(root: HTMLElement)` | Hydrates `[data-bubble-selector]`. On bubble click: swaps active category (CSS `data-active` attribute), filters showcase items via `[data-category]` attribute, dispatches `bubble:change` `CustomEvent` with `{ kind, slug }`. Listens to `carousel:active` to keep the `[data-meta-strip]` columns in sync as the carousel scrolls. |

### Layer B — Visual primitives (Astro components)

Located at `src/components/visual/<Name>.astro`. Each is a pure-render component with typed props; no client-side state.

| File | Props | What it renders |
|---|---|---|
| `Jellyfish.astro` | `{ seed: number; size: number; hue: number; accent: string }` | One SVG jellyfish: bell + 22 tendrils. Tendril paths generated at build time via a seeded mulberry32 PRNG in the component's frontmatter (no client RNG). |
| `Sparkles.astro` | `{ count?: number = 28; seed?: number }` | `count` SVG dots with seed-randomized opacity and animation-delay. All values baked at build time. |
| `Placeholder.astro` | `{ hue: number; glyph?: string; label?: string }` | OKLCH gradient placeholder for project covers (faux website screenshot style). |
| `CardPlaceholder.astro` | `{ hue: number; glyph?: string; label?: string }` | Smaller variant for subpage 8-card grid. |
| `Marquee.astro` | `{ items: string[]; sep?: string = '✦'; speedSec?: number = 32; dotColor?: string }` | Wraps the doubled-content marquee structure with `data-marquee` so `marquee.ts` can hydrate it. |

### Layer C — Section components (Astro components)

Located at `src/components/sections/<Name>.astro`. Each composes visual primitives and pages-data into a section of the homepage or a subpage.

| File | Props | Composition |
|---|---|---|
| `Hero.astro` | `{ lang: Lang }` | Three `<Jellyfish>` (different seeds + hues) inside `[data-jellyfish-stage]` + `<Sparkles>` + Carolina Rivera wordmark + scroll-fade. Consumes `jellyfish-drift.ts`. |
| `Showcase.astro` | `{ items: ProjectEntry[]; lang: Lang }` | Glassy scroll-snap carousel: `[data-carousel]` track of `<article data-category data-slug>` cards rendering `<Placeholder>` covers + faux browser chrome + project title/subtitle. Arrow buttons + dot indicators. Consumes `carousel.ts`. |
| `PortfolioSection.astro` | `{ kind: 'design' \| 'artwork'; lang: Lang }` | Section eyebrow + bubble row + `<Showcase>` + meta strip (Studio · Role · Sectors · Year) bound to `[data-meta-strip]`. Consumes `bubble-selector.ts`. Filters categories from the `categories` content collection by `kind`. |
| `Contact.astro` | `{ lang: Lang }` | Heading + three weighted lines + email Copy card on the left; "Send a message" form (Name / Email / Message / Send) + four social bubbles on the right. mailto: link, no backend. |
| `SubpageGrid.astro` | `{ category: CategoryEntry; projects: ProjectEntry[]; lang: Lang }` | 8-card tilted grid wrapped in `[data-tilt-grid]` so `carousel.ts`'s `initTiltGrid` can hydrate drag-to-pan behavior. Per-card rotation (`--tilt-rotate`) is baked at build time from each project's slug hash. Page dots + sister-category bubbles + footer email strip. |

### Data flow

- **Props down:** Page frontmatter pulls content collections via `getCollection`/`getEntry`, passes `ProjectEntry[]` and `CategoryEntry` arrays into section components as Astro props. All build-time.
- **Events up:** Single namespaced `CustomEvent` channel on `window` — `carousel:active` dispatched from `carousel.ts`, listened to by `bubble-selector.ts`. Bubble clicks update the active category by mutating data attributes on a known root element; carousel hydration re-keys when the bubble selector dispatches its own `bubble:change` event.

```
┌─ User clicks bubble "Branding" ────────────────────┐
│  bubble-selector.ts → setActiveCategory('branding')│
│  → mutates [data-active] attrs                     │
│  → filters [data-category=branding] showcase items │
│  → dispatches `bubble:change` { kind, slug }       │
└────────────────────────────────────────────────────┘
                      │
                      ▼
┌─ carousel.ts hears `bubble:change` ────────────────┐
│  → resets scroll position to 0                     │
│  → recomputes active card                          │
│  → dispatches `carousel:active` { index, slug }    │
└────────────────────────────────────────────────────┘
                      │
                      ▼
┌─ bubble-selector.ts hears `carousel:active` ───────┐
│  → updates [data-meta-strip] columns from project  │
│  → updates eyebrow text                            │
└────────────────────────────────────────────────────┘
```

This forms a stable two-event loop with no shared state object. Both modules are independently testable.

---

## 3. Pages and content

### 3.1 Pages restructured (Phase 0 stubs → full sections)

| Path | Becomes |
|---|---|
| `src/pages/index.astro` | `<BaseLayout>` → `<Hero>` → `<Marquee>` → `<PortfolioSection kind="design">` → `<Marquee>` → `<PortfolioSection kind="artwork">` → `<Marquee>` → `<Contact>` (Footer + Header already inside BaseLayout per Phase 0). |
| `src/pages/es/index.astro` | Spanish mirror, same composition with `lang="es"`. |
| `src/pages/design/[category].astro` | `<BaseLayout>` → `<SubpageGrid category={category} projects={projectsForCategory} lang="en">`. |
| `src/pages/artwork/[category].astro` | Same as above, kind=artwork. |
| `src/pages/es/design/[category].astro` and `src/pages/es/artwork/[category].astro` | Spanish mirrors. |

The four `[category].astro` files keep their `getStaticPaths()` from Phase 0; only the body changes.

### 3.2 Content additions

**8 placeholder project entries per category × 9 categories = 72 new project JSONs**, in addition to the 2 Phase-0 stubs (kept for backward-compat). All under `src/content/projects/<kind>/<category>/<NN>-<slug>.json` where `NN` is `01`–`08`. Each entry conforms to the existing schema (`src/content.config.ts`, untouched).

Placeholder JSON shape example (`src/content/projects/design/branding/01-aurora.json`):
```json
{
  "slug": "aurora",
  "kind": "design",
  "category": "branding",
  "title": { "en": "Aurora Studio", "es": "Aurora Studio" },
  "subtitle": { "en": "Identity system for a residency", "es": "Sistema de identidad para una residencia" },
  "studio": "Independent",
  "role": { "en": "Designer", "es": "Diseñadora" },
  "sectors": ["culture", "residency"],
  "year": 2025,
  "cover": "placeholder:hue=240",
  "gallery": []
}
```

The `cover` field uses a `placeholder:hue=NNN` URI scheme (no real image asset). `Placeholder.astro` parses this URI to derive the gradient hue. When real photos arrive in Carolina's content swap, the same field becomes a `/projects/<slug>/cover.jpg` path and the EXIF-strip rule binds.

Hue assignment per project: deterministic hash of the slug string (mulberry32 seeded by slug bytes summed) mapped to [200, 320] degrees so all placeholders stay in the cool periwinkle / lavender / cyan / magenta range that matches the design language.

### 3.3 i18n surface additions

Adds ~22 new keys to `src/i18n/{en,es}.json` (parity guard from Phase 0 will fail the build if any are missing on either side):

- `hero.cta` — primary CTA label
- `showcase.next`, `showcase.prev`, `showcase.dotLabel` — carousel controls
- `bubble.label` — "Selected" eyebrow connector
- `meta.studio`, `meta.role`, `meta.sectors`, `meta.year` — meta strip column headers
- `contact.form.name.label`, `contact.form.name.placeholder`
- `contact.form.email.label`, `contact.form.email.placeholder`
- `contact.form.message.label`, `contact.form.message.placeholder`
- `contact.form.send`, `contact.form.sent`, `contact.form.copied`
- `contact.email` — actual contact email address (placeholder for now: `hello@carolinariverart.com`; Carolina swaps later)
- `subpage.back`, `subpage.pageOf`, `subpage.relatedCategories`
- `marquee.items` — array of ticker phrases (kept short and translatable)

Carolina's contact email is a placeholder until she confirms; documented in §8 (out of scope).

---

## 4. Motion details

### 4.1 Custom cursor (`cursor.ts`)

- Two DOM nodes injected once into `<body>`: a 5px dot (`#cursor-dot`) and a 28×28 ring (`#cursor-ring`).
- Pointer-move listener updates target position; `requestAnimationFrame` loop lerps the ring toward the target with a soft easing (~0.18 per frame).
- Hover targets carry `data-cursor="link" | "media" | "drag"` and optional `data-cursor-label="…"`. Ring morphs:
  - `link` → 56px solid border, accent
  - `media` → 96px filled accent disk
  - `drag` → 72px dashed accent border
  - default → 28px solid ink border
- Disabled pathways: `window.matchMedia('(pointer: coarse)').matches === true` OR `(prefers-reduced-motion: reduce).matches === true` — `body.classList.add('no-cursor')` and dot/ring stay hidden.

### 4.2 Paint splash (`splash.ts`)

- Global `click` listener on `document`. On click, computes 8 angles uniformly around 360°, spawns 8 `<span class="splash-drop">` absolutely positioned at the click coords with hue rotated by index.
- Each drop animates via CSS keyframe `splash-fly` (translate + rotate + scale + fade) for ~620ms, then `animationend` removes the node.
- Five-color palette derived from accent: `--c-accent`, `#A8B5FA`, `#D4DCFF`, `#C5B8FF`, `#9F8CFF`. All rendered via CSS `radial-gradient`.
- Disabled by `prefers-reduced-motion`.

### 4.3 Marquee (`marquee.ts`)

- For each `[data-marquee]` element, clones the inner content once so the track holds two copies side by side.
- Track animates `transform: translateX(0) → translateX(-50%)` linearly at the configured speed; `animation-iteration-count: infinite`.
- Pauses on hover (`:hover` CSS rule).
- On `prefers-reduced-motion: reduce`, the keyframe is replaced (CSS media query) with a no-op so the marquee freezes mid-position.

### 4.4 Scroll reveals (`reveal.ts`)

- One shared IntersectionObserver, threshold 0.3.
- Elements with `[data-reveal]` start at opacity 0, `transform: translateY(24px)`. On enter, `data-revealed="true"` triggers a CSS transition to opacity 1, translateY 0.
- `[data-reveal-mask]` variant uses `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` for a horizontal mask reveal (used on hero wordmark + section titles).
- Reduced-motion fallback: elements render visible immediately (`data-revealed="true"` set on observer registration).

### 4.5 Jellyfish drift (`jellyfish-drift.ts`)

- For the `[data-jellyfish-stage]` root, finds N child `<Jellyfish>` elements and assigns each a CSS animation with a different `--drift-x`, `--drift-y`, `--drift-z`, `--drift-rot`, `--drift-duration`. CSS animations are pure (no JS frames).
- Scroll parallax: a single rAF loop maps the hero element's `getBoundingClientRect().top` to a CSS variable `--hero-fade` on the stage, used by the stage's opacity rule.
- Once the hero scrolls fully out of viewport, the rAF loop self-suspends until the next IntersectionObserver re-entry.
- Reduced-motion: animation duration set to `0s` via media query, and the rAF loop is skipped (stage stays at `--hero-fade: 1`).

### 4.6 Carousel (`carousel.ts`)

- CSS-only scroll-snap container (`scroll-snap-type: x mandatory` on track, `scroll-snap-align: center` on cards).
- IntersectionObserver per card with `root: track, threshold: [0, 0.5, 1]` reports the most-visible card; that card index is the active one.
- On active change, sets `[data-active]` on the active card (drives a CSS opacity/scale rule visually) and dispatches `carousel:active` with `{ index, slug }`.
- Arrow buttons call `card.scrollIntoView({ behavior: 'smooth', inline: 'center' })`.
- Keyboard: ArrowLeft / ArrowRight / Home / End on the track when focused.

### 4.7 Bubble selector (`bubble-selector.ts`)

- Bubbles rendered as `<button role="tab" data-category="<slug>" aria-selected="false">…</button>` in a `<div role="tablist">`.
- On click: removes `aria-selected="true"` from previous bubble, applies to clicked one. Updates eyebrow text from `t('bubble.label') · <Category Label>`. Re-filters showcase items by setting `[data-active-category]` on the section root; CSS hides cards whose `[data-category]` doesn't match.
- Listens to `carousel:active`: looks up the project by `slug`, updates `[data-meta-strip]` columns (`meta-strip-studio`, `meta-strip-role`, `meta-strip-sectors`, `meta-strip-year`) from the project record. Meta strip element has `aria-live="polite"` so screen readers announce changes.

### 4.8 Tilted draggable grid (`carousel.ts` named export `initTiltGrid`)

- 8 cards in a CSS Grid; each card receives `--tilt-rotate: <-3deg..3deg>` (deterministic per slug hash, baked into the rendered HTML at build time).
- The grid is wrapped in a horizontally-scrollable container with `scroll-snap` on each card. `initTiltGrid` adds drag-to-pan via pointer-down/move/up — translating `scrollLeft` by `-deltaX` so users can drag the row of cards.
- Reduced-motion: `--tilt-rotate: 0deg` (flat grid), drag handlers skip registration. Cards lay out as a plain responsive grid.

---

## 5. Accessibility

**Non-negotiable across all motion items:**

| Condition | Behavior |
|---|---|
| `prefers-reduced-motion: reduce` | Cursor disables (system cursor visible). Splash disables (no drops). Marquee freezes mid-position. Reveals render visible immediately. Drift stops; jellyfish are still. Tilted grid renders flat (`--tilt-rotate: 0deg`). |
| `pointer: coarse` (touch device) | Cursor disables only — every other motion item still runs. |

**Keyboard:**

| Component | Behavior |
|---|---|
| Bubble selector | Tab to first bubble. ArrowLeft/Right cycles, Enter activates, Home/End go to first/last. ARIA: `role="tablist"`, `aria-selected`, `aria-controls` linking to the showcase track. |
| Carousel | Tab to active card. ArrowLeft/Right scroll one card. Space or Enter activates the card's link. Track has `aria-roledescription="carousel"`. |
| Tilted grid | Standard tab order (DOM order). Each card focusable as a link; focus ring uses the box-shadow gap technique to guarantee 3:1 contrast on light cards. |
| Form (Contact) | All fields have explicit `<label for>`. Submit button is an actual `<button type="submit">`. Form submission opens mailto: in the user's mail client (no JS-only submission). |

**ARIA**: meta strip `aria-live="polite"`; carousel arrow buttons have `aria-label`; bubble selector announces category changes via `aria-current="true"` on the active bubble; subpage page-dots are `<button aria-label="Page N of 3">`.

**Color contrast**: `--c-accent` retains its light-mode prohibition on text (still flagged in `tokens.css`); focus ring uses an outer light box-shadow gap so the periwinkle ring is distinguishable on any background. Implements the deferred Phase 0 follow-up.

---

## 6. Performance

Lighthouse target on `/` (run during Task 18-equivalent verification): **90 perf / 95 a11y / 95 best-practices**. No bundle cap.

- All scripts as Astro client islands or deferred body-bottom modules. No React. No SSR.
- Splash + cursor lazy-load via `<script type="module" defer>` after first paint.
- Reveal observer registered once and reused across all elements.
- Drift rAF loop self-suspends when hero is off-screen.
- 72 placeholder projects: each is a JSON file processed at build time, no runtime fetch. Total content payload under 80KB.
- Fonts via Google Fonts CDN with `<link rel="preconnect">` (Phase 0 baseline). No raster images this phase.

---

## 7. Exit criteria

All must be true before merge:

1. `npm ci && npm run lint && npm run typecheck && npm run build` all green locally and in CI.
2. All 20 routes render full content with no "Phase 0 stub" placeholder text remaining.
3. EN/ES parity guard still passes (`getT.resolve` throws on missing keys, build fails). All ~22 new strings present in both `en.json` and `es.json`.
4. All 7 motion items render correctly on a Chrome/Firefox/Safari smoke run; cursor disables on touch + reduced-motion; reveals + drift + marquee + tilt all freeze/disable on reduced-motion as specified above.
5. Lighthouse on `/`: ≥ 90 perf, ≥ 95 a11y, ≥ 95 best-practices.
6. Manual smoke checklist documented in the README, including:
   - Hero: jellyfish drift visible; click to spawn splash drops; scroll-fade on hero as you scroll past
   - Design section: click each bubble; eyebrow + meta strip update; scroll the carousel; meta strip stays in sync with the active card
   - Artwork section: same as design with the 3 artwork categories
   - Contact: Copy email button works (`navigator.clipboard.writeText` with toast); Send button opens mailto: pre-filled
   - Subpage `/design/branding/`: tilted grid renders; drag horizontally to pan; page dots advance the visible card range; sister-category bubbles link to other design subpages
   - Reduced-motion smoke: `Settings → Reduce Motion` enabled; reload `/`; cursor uses system, no splash, jellyfish still, marquee frozen, reveals visible immediately, tilt grid flat
7. README updated with Phase 1 highlights and the smoke checklist link.

---

## 8. Out of scope

| Item | Reason |
|---|---|
| Real photographs | Carolina swaps later; EXIF-strip rule binds when she does. |
| Real project content | Carolina swaps later. Placeholder bilingual stubs hold the structure. |
| Sitemap, robots.txt, OG/Twitter meta | Phase 6-equivalent SEO concern; out of scope here. |
| Analytics, error reporting, third-party SDKs | Out of scope for a portfolio. |
| Custom domain wiring | Still on `jorius.github.io/portfolio-web-app-ciruela/` placeholder. Migrates to Carolina's GH account before launch (Phase-0 README documented this). |
| Tweaks panel | Locked-out per project memory rule. |
| Backend for the contact form | mailto: only, no Formspree/Web3Forms/etc. Confirmed during Phase 0 brainstorming. |
| Three.js jellyfish | Carolina explicitly rejected this twice. SVG only. |
| Real Carolina contact email | Placeholder `hello@carolinariverart.com` until Carolina confirms her preferred address. |

---

## 9. Risks and open questions

| Risk | Mitigation |
|---|---|
| 72 placeholder JSONs is a lot of content authoring busywork | A small Node script (`scripts/seed-placeholders.mjs`) generates them deterministically from a single source list. Script is part of this phase but runs once at scaffolding time and is documented. |
| Tilted-card drag UX is finicky on trackpads | We test horizontal-scroll + drag fall-through; if drag fights the trackpad, we disable drag and rely on scroll-snap alone. This decision lands in the implementation plan, not the spec. |
| Lighthouse 90 perf may slip with all 7 motion items | If we land below 90, we cut sparkles + reduce drift loop work first. Documented in §6. |
| `cursor.ts` tracks a global mouse position — leaks if not cleaned up on page navigation | Astro static-output means full page reloads on navigation, so listener cleanup isn't an issue here. |
| Real Carolina email TBD — placeholder shows on every page | Spec §3.3 lists this as an explicit placeholder; pre-launch checklist in Phase 6 will swap it. |

No blocking open questions at spec time.

---

## 10. Branching, commits, and review

- Branch: `feature/phase-1-design`, branched from `feature/phase-0-scaffold` (PR #1 still open).
- Phase 1 PR targets `main`. Until Phase 0 merges, the Phase 1 PR shows the stacked diff; once Phase 0 merges, the Phase 1 PR rebases onto a clean main and shows only Phase 1's changes.
- **Commit message style:** Jericho — capitalized infinitive verb subject, no period, ≤72 chars, body explains *why*.
- **Commit author trailer:** **No `Co-Authored-By` trailer on Phase 1 commits**. Per the project memory rule saved at session start, the AI co-author trailer is added only during scaffolding (Phase 0); design implementation commits attribute work to Jose only.
- All commits GPG-signed by `Jose Ríos <josed.riosc@gmail.com>` (key `365602820FC1B86C`).

---

## 11. Done definition for this spec

This document is approved when Jose signs off in the conversation thread. After approval, the implementation plan is generated by the `superpowers:writing-plans` skill, then execution proceeds via `superpowers:subagent-driven-development` per the same protocol used for Phase 0.
