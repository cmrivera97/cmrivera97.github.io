# Phase 3 — Feedback Round 3 — Design Spec

**Date:** 2026-07-02
**Branch:** `feature/phase-3-feedback-round`
**Status:** Implemented and verified locally (headless screenshots); pending merge to `main`.

## Context

The deployed site (`cmrivera97.github.io`, served from `main`) is **19 commits behind** this
branch, so several reported problems were already fixed here and only needed to ship, while three
were genuinely open:

| Reported | Root cause | Resolution |
|---|---|---|
| Hero video not playing | Hero videos are Git-LFS; GitHub Pages serves the ~130 B LFS **pointer**, and the deploy workflow checked out without `lfs: true` | Added `lfs: true` to the deploy checkout — build now bundles real bytes |
| "Tocobo" broken image (Makeup) | `kind: video` rendered as `<img>` on `main`; video-playback fix (`41a8663`) only on this branch | Ships on merge (already fixed on branch) |
| Detail-gallery images cropped | `object-fit: cover` on `main` | Ships on merge (branch already `contain`) — **plus** the oversized frame fixed below |
| Detail-gallery **frame too big** | Cards were a fixed-width box; `contain`ed portrait images left large dead frame | Frame now hugs each image (item 2a) |
| Home/category **preview tiles** cropped | `object-fit: cover` on fixed-ratio labeled tiles | Contain + blurred backdrop (item 2b) |
| No full-screen viewing | Feature never built | New lightbox (item 3) |
| Can't upload heavy videos | PagesCMS uploader 413s; LFS is a dead end on Pages | Direct-commit workflow (item 1) |

A scan of all 39 projects / 196 media refs found no other broken/missing/mismatched references.

## Item 4 — Hero video (DONE)

`.github/workflows/deploy.yml` checkout sets `lfs: true`. Hero plays after the next deploy to `main`.

## Item 1 — Video pipeline (DECIDED: keep hero in LFS, plain blobs for new videos)

- Hero videos stay in Git LFS (fixed by `lfs: true`). `.gitattributes` unchanged.
- New **content** videos are committed as plain (non-LFS) files under `public/images/` — that
  folder is not LFS-tracked, so Pages serves them directly (existing gallery clips already do).
  The gallery already renders `kind: video` as `<video>`, and `.pages.yml` lists `mp4`, so once a
  clip is committed it can be referenced from the CMS.
- **Workflow for Carolina:** commit the video via git or the GitHub web UI (≤ 25 MB web, ≤ 100 MB
  git) into `public/images/`, then pick it in the CMS gallery item as a `video`. The PagesCMS
  uploader itself is bypassed for large video (it 413s). No code change required.

## Item 2a — Detail-gallery frame hugs the image (DONE)

`.gallery` card/frame/screen are `width/height: auto` so they shrink-wrap each image (capped by a
`74vh` / `86vw` viewport band) with a thin 10px glass band — no oversized container, no letterbox,
for portrait or landscape. `carousel.ts` now derives the coverflow step from the **centred** card
(cards vary in width) and re-lays out once each image's real dimensions load.

## Item 2b — Preview tiles: contain + blurred backdrop (DONE, category only)

New `MediaFit.astro` renders the whole image (`contain`) over a soft blurred zoom of the same
image, so labeled tiles stop cropping while staying uniform and keeping their title/tag overlays.
Applied to the **category grid** (`SubpageGrid`). The **home showcase carousel** was reverted at
the user's request to its original fixed cover-cropped cards. The detail gallery does not use
`MediaFit` (it hugs instead).

## Item 3 — Full-screen lightbox (DONE)

`src/scripts/lightbox.ts` + overlay markup in `Gallery.astro`. Click the **centred** gallery card
→ dark overlay with the media shown whole (`contain`), caption = alt text, `n / total` counter,
‹ / › navigation, and Esc / backdrop / × to close. Focus-trapped, scroll-locked (`body.nav-locked`),
focus restored on close, reduced-motion aware. Videos open with native controls. Side-card clicks
are left to the carousel (a document-capture listener reads the active card before the carousel
re-centres, so only the centred card opens). Localized `detail.close` / `detail.expand` keys added.

## Broken images

None beyond what merging ships (the Tocobo `kind: video` renders correctly on this branch).

## Verification

- `astro check` (0/0/0), `eslint --max-warnings=0` clean, `astro build` (98 pages) green.
- Headless screenshots confirmed: detail frame hugs portrait/landscape, category + home tiles show
  full images with blurred backdrop and intact labels, lightbox opens/navigates/captions/closes.

## Merge / deploy

`main` ← `feature/phase-3-feedback-round` via **merge commit** (no rebase). Pushing `main` triggers
`deploy.yml`; the `lfs: true` change must be on `main` for the hero to work in production.

## Housekeeping

- `.gitignore` now excludes `*.pdf` (feedback docs kept local).
- Two obsolete stashes superseded by branch commits can be dropped.
- Fully-merged stale branches (`feature/observaciones-website-3.0`, `feature/pages-cms-integration`,
  `deploy-clean`, `deploy/carolina-main`) can be deleted.

## Commit authoring

Commits authored as the local git user (Carolina Rivera, `cm.rivera`); no Claude co-author trailer.
