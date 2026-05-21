const SHOULD_SKIP_PARALLAX = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface DriftConfig {
  x: number;
  y: number;
  rot: number;
  duration: number;
}

const DRIFTS: DriftConfig[] = [
  {
    x: 14, y: 22, rot: 5, duration: 13,
  },
  {
    x: -18, y: 16, rot: -4, duration: 17,
  },
  {
    x: 10, y: -14, rot: 3, duration: 19,
  },
];

export const initJellyfishDrift = (): void => {
  if (typeof document === 'undefined') return;

  const stage = document.querySelector<HTMLElement>('[data-jellyfish-stage]');
  if (!stage) return;

  const slots = stage.querySelectorAll<HTMLElement>('.jellyfish-slot');
  slots.forEach((slotEl, i) => {
    const cfg = DRIFTS[i % DRIFTS.length] ?? DRIFTS[0];
    if (!cfg) return;
    slotEl.style.setProperty('--drift-x', `${cfg.x}px`);
    slotEl.style.setProperty('--drift-y', `${cfg.y}px`);
    slotEl.style.setProperty('--drift-rot', `${cfg.rot}deg`);
    slotEl.style.setProperty('--drift-duration', `${cfg.duration}s`);
    slotEl.style.setProperty('animation-delay', `${i * -2.7}s`);
  });

  if (SHOULD_SKIP_PARALLAX()) return;

  let inViewport = true;
  const io = new IntersectionObserver(([entry]) => {
    inViewport = entry?.isIntersecting ?? false;
  }, { threshold: 0 });
  io.observe(stage);

  const tick = (): void => {
    if (inViewport) {
      const rect = stage.getBoundingClientRect();
      const fade = Math.max(0, Math.min(1, 1 - (-rect.top / 700)));
      stage.style.setProperty('--hero-fade', `${fade}`);
    }
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
};
