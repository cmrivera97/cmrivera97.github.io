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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initSplash = (_accent: string = '#7A8FF7'): void => {
  if (typeof document === 'undefined') return;
  if (SHOULD_DISABLE()) return;

  document.addEventListener('click', (e: MouseEvent) => {
    if ((e.target as Element).closest('input,textarea,select,[data-no-splash]')) return;

    const x = e.clientX;
    const y = e.clientY;
    const drops = 8;

    for (let i = 0; i < drops; i += 1) {
      const dx = (Math.random() - 0.5) * 140;
      const dy = (Math.random() - 0.5) * 140 - 30;
      const size = 4 + Math.random() * 8;
      const color = PALETTE[i % PALETTE.length] ?? PALETTE[0];
      const rot = Math.random() * 90 - 45;
      const isBlob = Math.random() < 0.5;
      const borderRadius = isBlob ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '50%';

      const drop = document.createElement('span');
      drop.className = 'splash-drop';
      drop.style.left = `${x}px`;
      drop.style.top = `${y}px`;
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      drop.style.background = color;
      drop.style.borderRadius = borderRadius;
      drop.style.setProperty('--dx', `${dx}px`);
      drop.style.setProperty('--dy', `${dy}px`);
      drop.style.setProperty('--rot', `${rot}deg`);
      drop.addEventListener('animationend', () => { drop.remove(); }, { once: true });
      document.body.appendChild(drop);
    }
  });
};
