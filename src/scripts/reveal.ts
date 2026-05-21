const SHOULD_AUTO_REVEAL = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const initReveal = (): void => {
  if (typeof document === 'undefined') return;

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-mask]');

  if (SHOULD_AUTO_REVEAL()) {
    targets.forEach((el) => {
      // eslint-disable-next-line no-param-reassign
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
            // eslint-disable-next-line no-param-reassign
            el.dataset.revealed = 'true';
          }, delay);
        } else {
          // eslint-disable-next-line no-param-reassign
          el.dataset.revealed = 'true';
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach((el) => observer.observe(el));
};
