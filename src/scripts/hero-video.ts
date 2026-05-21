const SRC = {
  h: { dark: '/video/hero-h-dark.mp4', light: '/video/hero-h-light.mp4' },
  v: { dark: '/video/hero-v-dark.mp4', light: '/video/hero-v-light.mp4' },
};

export const initHeroVideo = (): void => {
  if (typeof document === 'undefined') return;
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const stage = document.querySelector<HTMLElement>('.hero-stage');
  if (!video || !stage) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pick = (): void => {
    const dark = document.documentElement.dataset.theme === 'dark';
    const orient: 'h' | 'v' = window.matchMedia('(max-width: 768px)').matches ? 'v' : 'h';
    const theme: 'dark' | 'light' = dark ? 'dark' : 'light';
    const next = SRC[orient][theme];
    if (!video.src.endsWith(next)) {
      video.src = next;
      video.poster = next.replace('.mp4', '-poster.jpg');
      if (!reduce) video.play().catch(() => {});
    }
  };

  pick();
  window.matchMedia('(max-width: 768px)').addEventListener('change', pick);
  document.addEventListener('themechange', pick);

  if (reduce) { video.removeAttribute('autoplay'); video.pause(); }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      stage.style.setProperty('--hero-fade', String(Math.max(0, 1 - y / 700)));
      stage.style.setProperty('--hero-shift', `${y * -0.06}px`);
      ticking = false;
    });
  }, { passive: true });
};
