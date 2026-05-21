const PALETTE = [
  'var(--c-splash-1)',
  'var(--c-splash-2)',
  'var(--c-splash-3)',
  'var(--c-splash-4)',
  'var(--c-splash-5)',
] as const;

const SHOULD_DISABLE = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const spawnDrop = (x: number, y: number, angleDeg: number, distance: number, color: string): void => {
  const drop = document.createElement('span');
  drop.className = 'splash-drop';
  const radians = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(radians) * distance;
  const dy = Math.sin(radians) * distance;
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  drop.style.background = `radial-gradient(circle at 30% 30%, ${color} 0%, transparent 70%)`;
  drop.style.setProperty('--dx', `${dx}px`);
  drop.style.setProperty('--dy', `${dy}px`);
  drop.addEventListener('animationend', () => {
    drop.remove();
  }, { once: true });
  document.body.appendChild(drop);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initSplash = (_accent: string = '#7A8FF7'): void => {
  if (typeof document === 'undefined') return;
  if (SHOULD_DISABLE()) return;

  document.addEventListener('click', (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const drops = 8;
    const baseDistance = 60;
    for (let i = 0; i < drops; i += 1) {
      const angle = (360 / drops) * i + (Math.random() - 0.5) * 20;
      const distance = baseDistance + Math.random() * 40;
      const color = PALETTE[i % PALETTE.length] ?? PALETTE[0];
      spawnDrop(x, y, angle, distance, color);
    }
  });
};
