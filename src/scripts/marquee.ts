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
