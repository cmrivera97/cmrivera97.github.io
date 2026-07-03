/* ============================================================================
 * Full-screen lightbox for the project-detail gallery.
 * Clicking the CENTRED gallery card opens a dark overlay with the media shown whole
 * (contain) plus its caption; ‹ / › cycle the gallery, Esc / backdrop / × close.
 * Side-card clicks are left to carousel.ts (which brings them to centre) — a
 * document-level capture listener runs before the carousel's track handler, so it can
 * read the active card before the carousel re-centres and only act on the centred one.
 * ========================================================================== */

interface LightboxItem {
  kind: 'image' | 'video';
  src: string;
  caption: string;
}

export const initLightbox = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const scope = root ?? document;
  const gallery = scope.querySelector<HTMLElement>('.gallery');
  const overlay = scope.querySelector<HTMLElement>('[data-lightbox]');
  if (!gallery || !overlay) return;

  const mediaEls = Array.from(
    gallery.querySelectorAll<HTMLElement>('.showcase-screen img, .showcase-screen video'),
  );
  const items: LightboxItem[] = mediaEls
    .map((el) => ({
      kind: el.tagName === 'VIDEO' ? ('video' as const) : ('image' as const),
      src: el.getAttribute('src') ?? '',
      caption: el.getAttribute('alt') ?? el.getAttribute('aria-label') ?? '',
    }))
    .filter((it) => it.src);
  if (items.length === 0) return;
  mediaEls.forEach((el, i) => {
    // eslint-disable-next-line no-param-reassign
    el.dataset.lbIndex = String(i);
  });

  const mediaBox = overlay.querySelector<HTMLElement>('[data-lb-media]');
  const captionEl = overlay.querySelector<HTMLElement>('[data-lb-caption]');
  const countEl = overlay.querySelector<HTMLElement>('[data-lb-count]');
  const prevBtn = overlay.querySelector<HTMLButtonElement>('[data-lb-prev]');
  const nextBtn = overlay.querySelector<HTMLButtonElement>('[data-lb-next]');
  const closeBtn = overlay.querySelector<HTMLButtonElement>('[data-lb-close]');
  const backdrop = overlay.querySelector<HTMLElement>('[data-lb-backdrop]');
  if (!mediaBox || !captionEl || !prevBtn || !nextBtn || !closeBtn || !backdrop) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const single = items.length < 2;
  prevBtn.hidden = single;
  nextBtn.hidden = single;

  let current = 0;
  let lastFocused: HTMLElement | null = null;

  const stopVideo = (): void => {
    mediaBox.querySelector('video')?.pause();
  };

  const render = (i: number): void => {
    current = ((i % items.length) + items.length) % items.length;
    const item = items[current];
    stopVideo();
    mediaBox.replaceChildren();
    let node: HTMLElement;
    if (item.kind === 'video') {
      const v = document.createElement('video');
      v.src = item.src;
      v.controls = true;
      v.autoplay = true;
      v.muted = true;
      v.loop = true;
      v.setAttribute('playsinline', '');
      node = v;
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption;
      node = img;
    }
    node.className = 'lightbox-el';
    mediaBox.appendChild(node);
    captionEl.textContent = item.caption;
    if (countEl) countEl.textContent = single ? '' : `${current + 1} / ${items.length}`;
  };

  const open = (i: number): void => {
    lastFocused = document.activeElement as HTMLElement | null;
    render(i);
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-locked');
    if (reduce) overlay.classList.add('is-open');
    else requestAnimationFrame(() => overlay.classList.add('is-open'));
    closeBtn.focus();
  };

  const close = (): void => {
    stopVideo();
    overlay.classList.remove('is-open');
    const finish = (): void => {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      mediaBox.replaceChildren();
    };
    if (reduce) finish();
    else window.setTimeout(finish, 200);
    document.body.classList.remove('nav-locked');
    lastFocused?.focus?.();
  };

  const go = (dir: number): void => render(current + dir);

  // Open on a click of the centred gallery card; leave side-card clicks to the carousel.
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>(
      '.gallery .showcase-screen img, .gallery .showcase-screen video',
    );
    if (!el) return;
    const card = el.closest<HTMLElement>('.showcase-card');
    if (!card || card.dataset.active !== 'true') return;
    e.preventDefault();
    e.stopPropagation();
    open(Number(el.dataset.lbIndex ?? '0'));
  }, true);

  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  overlay.addEventListener('keydown', (e: KeyboardEvent) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (!single && e.key === 'ArrowLeft') { e.preventDefault(); go(-1); return; }
    if (!single && e.key === 'ArrowRight') { e.preventDefault(); go(1); return; }
    if (e.key === 'Tab') {
      const focusables = Array.from(
        overlay.querySelectorAll<HTMLButtonElement>('button:not([hidden])'),
      ).filter((b) => b.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
};
