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
    // eslint-disable-next-line no-param-reassign
    card.dataset.active = i === activeIdx ? 'true' : 'false';
  });
};

const dispatchActive = (track: HTMLElement, detail: CarouselActiveDetail): void => {
  window.dispatchEvent(new CustomEvent<CarouselActiveDetail>('carousel:active', { detail }));
  // eslint-disable-next-line no-param-reassign
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

export const initTiltGrid = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const grids = (root ?? document).querySelectorAll<HTMLElement>('[data-tilt-grid]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  grids.forEach((grid) => {
    if (reduced) {
      grid.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
        // eslint-disable-next-line no-param-reassign
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
      // eslint-disable-next-line no-param-reassign
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

export type { CarouselActiveDetail };
