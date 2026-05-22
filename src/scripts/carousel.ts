interface CarouselActiveDetail {
  index: number;
  slug: string;
}

const centerOn = (track: HTMLElement, index: number, behavior: ScrollBehavior = 'auto'): void => {
  const cards = Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'));
  const card = cards[index];
  if (!card) return;
  const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
  track.scrollTo({ left, behavior });
};

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
  const showcase = track.closest('.showcase');
  if (!showcase) return;
  showcase.querySelectorAll<HTMLElement>('[data-dot]').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIdx);
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

    const showcase = track.closest('.showcase');
    if (showcase) {
      showcase.querySelectorAll<HTMLButtonElement>('[data-carousel-arrow]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const dir = btn.dataset.carouselArrow === 'next' ? 1 : -1;
          const cards = Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'));
          const currentIdx = Number.parseInt(track.dataset.activeIndex ?? '0', 10);
          const nextIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dir));
          centerOn(track, nextIdx, 'smooth');
        });
      });

      showcase.querySelectorAll<HTMLButtonElement>('[data-dot]').forEach((dot) => {
        dot.addEventListener('click', () => {
          centerOn(track, Number(dot.dataset.index), 'smooth');
        });
      });
    }

    track.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const cards = Array.from(track.querySelectorAll<HTMLElement>('.showcase-card'));
        const currentIdx = Number.parseInt(track.dataset.activeIndex ?? '0', 10);
        const nextIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dir));
        centerOn(track, nextIdx, 'smooth');
      }
    });

    centerOn(track, 0);
    setActive(track, 0);
    dispatchActive(track, { index: 0, slug: track.querySelector<HTMLElement>('.showcase-card')?.dataset.slug ?? '' });
  });

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
};

export type { CarouselActiveDetail };
