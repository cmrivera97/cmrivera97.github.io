// Declarative scroll parallax. Tag an element with `data-parallax="<speed>"` where a
// positive speed makes it lag behind the page (background depth); add
// `data-parallax-scale="<n>"` to keep a full-bleed element (e.g. the hero video) oversized
// so its edges never reveal during the drift. One rAF-throttled scroll listener drives all
// tagged elements. Disabled under reduced-motion and on coarse pointers, matching the other
// motion modules (see the body-level capability flags set in BaseLayout).

interface ParallaxItem {
  el: HTMLElement;
  speed: number;
  scale: number;
}

export const initParallax = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const docEl = document.documentElement;
  if (docEl.dataset.reducedMotion === 'true' || docEl.dataset.pointerCoarse === 'true') return;

  const items: ParallaxItem[] = Array.from(
    (root ?? document).querySelectorAll<HTMLElement>('[data-parallax]'),
  ).map((el) => ({
    el,
    speed: Number.parseFloat(el.dataset.parallax ?? '0') || 0,
    scale: Number.parseFloat(el.dataset.parallaxScale ?? '1') || 1,
  }));
  if (items.length === 0) return;

  let ticking = false;

  const update = (): void => {
    const half = (window.innerHeight || docEl.clientHeight) / 2;
    items.forEach(({ el, speed, scale }) => {
      const rect = el.getBoundingClientRect();
      const fromCenter = rect.top + rect.height / 2 - half;
      // Positive speed => lag: as the page scrolls down, the element drifts down a fraction.
      const shift = -fromCenter * speed;
      const scalePart = scale !== 1 ? ` scale(${scale})` : '';
      // eslint-disable-next-line no-param-reassign
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)${scalePart}`;
    });
    ticking = false;
  };

  const requestUpdate = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
};
