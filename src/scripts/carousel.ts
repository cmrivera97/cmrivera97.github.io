interface CarouselActiveDetail {
  index: number;
  slug: string;
}

const getCards = (track: HTMLElement): HTMLElement[] => (
  Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'))
);

const dispatchActive = (track: HTMLElement, index: number, slug: string): void => {
  // eslint-disable-next-line no-param-reassign
  track.dataset.activeIndex = String(index);
  window.dispatchEvent(
    new CustomEvent<CarouselActiveDetail>('carousel:active', { detail: { index, slug } }),
  );
};

const setDots = (track: HTMLElement, active: number): void => {
  const showcase = track.closest('.showcase');
  if (!showcase) return;
  showcase.querySelectorAll<HTMLElement>('[data-dot]').forEach((dot, i) => {
    dot.classList.toggle('active', i === active);
  });
};

/* ============================================================================
 * Loop (coverflow) carousel — home showcase, marked data-carousel="loop".
 * Centre card highlighted, neighbours peek on each side, wraps endlessly so the
 * card before the first is the last one.
 * ========================================================================== */

// Distance between adjacent card centres, as a fraction of card width (< 1 so neighbours
// overlap the centre card and peek from its sides).
const STEP_FACTOR = 0.72;

// Shortest signed distance from the active card to card `i`, wrapped onto a ring.
const ringSlot = (i: number, active: number, count: number): number => {
  let d = (i - active) % count;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
};

const slotScale = (abs: number): number => {
  if (abs === 0) return 1;
  if (abs === 1) return 0.84;
  return 0.7;
};

const slotOpacity = (abs: number): number => {
  if (abs === 0) return 1;
  if (abs === 1) return 0.6;
  return 0;
};

const layoutLoop = (track: HTMLElement, active: number): void => {
  const cards = getCards(track);
  const count = cards.length;
  if (count === 0) return;
  const cardWidth = cards[0].offsetWidth;
  if (cardWidth === 0) return; // hidden (display:none) — re-laid out when its category shows
  const step = cardWidth * STEP_FACTOR;

  cards.forEach((card, i) => {
    const d = ringSlot(i, active, count);
    const abs = Math.abs(d);
    const scale = slotScale(abs);
    const opacity = slotOpacity(abs);
    // Animate transforms only within the visible band (±2); cards wrapping across the seam
    // jump instantly while invisible so nothing slides across the whole row.
    const animate = abs <= 2;
    /* eslint-disable no-param-reassign */
    card.style.transition = animate
      ? 'transform .55s var(--ease-soft), opacity .45s ease'
      : 'opacity .2s ease';
    card.style.transform = `translate(-50%, -50%) translateX(${(d * step).toFixed(1)}px) scale(${scale})`;
    card.style.opacity = String(opacity);
    card.style.zIndex = String(30 - abs * 10);
    card.style.pointerEvents = abs === 0 ? 'auto' : 'none';
    card.dataset.active = d === 0 ? 'true' : 'false';
    card.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    card.tabIndex = d === 0 ? 0 : -1;
    /* eslint-enable no-param-reassign */
  });
};

const renderLoop = (track: HTMLElement, active: number): void => {
  layoutLoop(track, active);
  setDots(track, active);
  const slug = getCards(track)[active]?.dataset.slug ?? '';
  dispatchActive(track, active, slug);
};

const initLoopTrack = (track: HTMLElement): void => {
  const count = getCards(track).length;
  if (count === 0) return;

  const getActive = (): number => Number.parseInt(track.dataset.activeIndex ?? '0', 10);
  const goTo = (index: number): void => renderLoop(track, ((index % count) + count) % count);
  const move = (dir: number): void => goTo(getActive() + dir);

  const showcase = track.closest('.showcase');
  if (showcase) {
    showcase.querySelectorAll<HTMLButtonElement>('[data-carousel-arrow]').forEach((btn) => {
      btn.addEventListener('click', () => move(btn.dataset.carouselArrow === 'next' ? 1 : -1));
    });
    showcase.querySelectorAll<HTMLButtonElement>('[data-dot]').forEach((dot) => {
      dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
    });
  }

  track.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      move(e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  // Touch swipe (mobile): a deliberate horizontal swipe steps one card.
  let startX = 0;
  let startY = 0;
  track.addEventListener('touchstart', (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  }, { passive: true });

  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => layoutLoop(track, getActive()), 120);
  }, { passive: true });

  renderLoop(track, 0);
};

/* ============================================================================
 * Scroll carousel — project-detail gallery (native horizontal scroll + snap).
 * ========================================================================== */

const centerOn = (track: HTMLElement, index: number, behavior: ScrollBehavior = 'auto'): void => {
  const card = getCards(track)[index];
  if (!card) return;
  const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
  track.scrollTo({ left, behavior });
};

const findActiveCard = (track: HTMLElement): { index: number; card: HTMLElement } | null => {
  const cards = getCards(track);
  if (cards.length === 0) return null;
  const trackRect = track.getBoundingClientRect();
  const center = trackRect.left + trackRect.width / 2;
  let best = { index: 0, card: cards[0] as HTMLElement, distance: Infinity };
  cards.forEach((card, i) => {
    const r = card.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - center);
    if (d < best.distance) best = { index: i, card, distance: d };
  });
  return { index: best.index, card: best.card };
};

const setScrollActive = (track: HTMLElement, activeIdx: number): void => {
  getCards(track).forEach((card, i) => {
    // eslint-disable-next-line no-param-reassign
    card.dataset.active = i === activeIdx ? 'true' : 'false';
  });
  setDots(track, activeIdx);
};

const initScrollTrack = (track: HTMLElement): void => {
  const computeAndDispatch = (): void => {
    const result = findActiveCard(track);
    if (!result) return;
    setScrollActive(track, result.index);
    dispatchActive(track, result.index, result.card.dataset.slug ?? '');
  };

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  track.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(computeAndDispatch, 80);
  }, { passive: true });

  const showcase = track.closest('.showcase');
  if (showcase) {
    showcase.querySelectorAll<HTMLButtonElement>('[data-carousel-arrow]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.carouselArrow === 'next' ? 1 : -1;
        const cards = getCards(track);
        const currentIdx = Number.parseInt(track.dataset.activeIndex ?? '0', 10);
        const nextIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dir));
        centerOn(track, nextIdx, 'smooth');
      });
    });
    showcase.querySelectorAll<HTMLButtonElement>('[data-dot]').forEach((dot) => {
      dot.addEventListener('click', () => centerOn(track, Number(dot.dataset.index), 'smooth'));
    });
  }

  track.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const cards = getCards(track);
      const currentIdx = Number.parseInt(track.dataset.activeIndex ?? '0', 10);
      const nextIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dir));
      centerOn(track, nextIdx, 'smooth');
    }
  });

  centerOn(track, 0);
  setScrollActive(track, 0);
  dispatchActive(track, 0, getCards(track)[0]?.dataset.slug ?? '');
};

/* ========================================================================== */

export const initCarousel = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const tracks = (root ?? document).querySelectorAll<HTMLElement>('[data-carousel]');

  tracks.forEach((track) => {
    if (track.dataset.carousel === 'loop') initLoopTrack(track);
    else initScrollTrack(track);
  });

  window.addEventListener('bubble:change', () => {
    // A formerly-hidden loop carousel is now visible: re-measure and feature the first card.
    tracks.forEach((track) => {
      if (track.dataset.carousel === 'loop') renderLoop(track, 0);
    });
  });
};

export type { CarouselActiveDetail };
