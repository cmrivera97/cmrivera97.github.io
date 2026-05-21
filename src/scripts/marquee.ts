export const initMarquee = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;

  (root ?? document).querySelectorAll<HTMLElement>('[data-marquee-track]').forEach((track) => {
    if (track.dataset.marqueeHydrated === 'true') return;
    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    // eslint-disable-next-line no-param-reassign
    track.dataset.marqueeHydrated = 'true';
  });
};
