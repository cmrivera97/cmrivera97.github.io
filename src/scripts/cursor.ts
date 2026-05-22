type CursorMode = 'link' | 'media' | 'drag' | null;

const SHOULD_DISABLE = (): boolean => {
  if (typeof window === 'undefined') return true;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return coarse || reduced;
};

const ensureNodes = (): { dot: HTMLDivElement; ring: HTMLDivElement } => {
  let dot = document.getElementById('cursor-dot') as HTMLDivElement | null;
  let ring = document.getElementById('cursor-ring') as HTMLDivElement | null;
  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);
  }
  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);
  }
  return { dot, ring };
};

const applyMode = (ringEl: HTMLDivElement, dotEl: HTMLDivElement, mode: CursorMode, label: string, accent: string): void => {
  const sizes: Record<Exclude<CursorMode, null>, number> = { link: 56, media: 96, drag: 72 };
  const ringSize = mode === null ? 28 : sizes[mode];
  const half = ringSize / 2;
  const rs = ringEl.style;
  rs.width = `${ringSize}px`;
  rs.height = `${ringSize}px`;
  rs.marginLeft = `${-half}px`;
  rs.marginTop = `${-half}px`;
  if (mode === 'media') {
    rs.background = accent;
    rs.borderColor = 'transparent';
  } else if (mode === 'drag') {
    rs.background = 'transparent';
    rs.border = `1.5px dashed ${accent}`;
  } else {
    rs.background = 'transparent';
    rs.border = '1.5px solid var(--c-ink)';
  }
  if (mode === 'media' && label) {
    // eslint-disable-next-line no-param-reassign
    ringEl.textContent = label;
    // long labels get a smaller type size so they never reach the ring edge
    rs.fontSize = label.length > 10 ? '8px' : '9.5px';
  } else {
    // eslint-disable-next-line no-param-reassign
    ringEl.textContent = '';
    rs.fontSize = '';
  }
  const ds = dotEl.style;
  ds.opacity = mode === null ? '1' : '0';
};

export const initCursor = (accent: string = '#7A8FF7'): void => {
  if (typeof document === 'undefined') return;
  if (SHOULD_DISABLE()) {
    document.body.classList.remove('has-cursor');
    document.body.classList.add('no-cursor');
    return;
  }

  document.body.classList.remove('no-cursor');
  document.body.classList.add('has-cursor');

  const { dot, ring } = ensureNodes();

  const target = { x: -100, y: -100 };
  const dotPos = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  const lerp = 0.18;
  let mode: CursorMode = null;
  let label = '';

  const updateMode = (nextMode: CursorMode, nextLabel: string): void => {
    if (nextMode !== mode || nextLabel !== label) {
      mode = nextMode;
      label = nextLabel;
      applyMode(ring, dot, mode, label, accent);
    }
  };

  const onMove = (e: PointerEvent): void => {
    target.x = e.clientX;
    target.y = e.clientY;
    const el = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
    const nextMode = (el?.dataset.cursor as CursorMode) ?? null;
    const nextLabel = el?.dataset.cursorLabel ?? '';
    updateMode(nextMode, nextLabel);
  };

  window.addEventListener('pointermove', onMove, { passive: true });

  const tick = (): void => {
    dotPos.x = target.x;
    dotPos.y = target.y;
    ringPos.x += (target.x - ringPos.x) * lerp;
    ringPos.y += (target.y - ringPos.y) * lerp;
    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
};
