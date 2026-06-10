const BASE = import.meta.env.BASE_URL;
const SRC = {
  h: `${BASE}video/d2.mp4`,
  v: `${BASE}video/hero-v-dark.mp4`,
};

export const initHeroVideo = (): void => {
  if (typeof document === 'undefined') return;
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const stage = document.querySelector<HTMLElement>('.hero-stage');
  if (!video || !stage) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero is always the dark "Medusa" cut regardless of theme; only orientation varies.
  const pick = (): void => {
    const orient: 'h' | 'v' = window.matchMedia('(max-width: 768px)').matches ? 'v' : 'h';
    const next = SRC[orient];
    if (!video.src.endsWith(next)) {
      video.src = next;
      video.poster = next.replace('.mp4', '-poster.jpg');
      if (!reduce) video.play().catch(() => {});
    }
  };

  pick();
  window.matchMedia('(max-width: 768px)').addEventListener('change', pick);

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
