export const initMegaMenu = (): void => {
  if (typeof document === 'undefined') return;
  const CLOSE_DELAY_MS = 180;
  const SCROLL_SUPPRESS_MS = 800;
  const isMobile = (): boolean => window.matchMedia('(max-width: 768px)').matches;
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-mega]'));
  const panels = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-mega-panel]').forEach((p) => {
    const key = p.dataset.megaPanel;
    if (key) panels.set(key, p);
  });
  const header = document.querySelector<HTMLElement>('.site-header');

  let openKey: string | null = null;
  let pinned = false;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let suppressScrollClose = false;

  const render = (): void => {
    panels.forEach((panel, k) => {
      if (k === openKey) panel.setAttribute('data-open', '');
      else panel.removeAttribute('data-open');
    });
    triggers.forEach((trigger) => {
      const isOpen = trigger.dataset.mega === openKey;
      trigger.setAttribute('aria-expanded', String(isOpen));
      trigger.classList.toggle('is-open', isOpen);
    });
  };

  const open = (key: string | null, opts: { pin?: boolean } = {}): void => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    openKey = key;
    if (key === null) pinned = false;
    else if (opts.pin) pinned = true;
    render();
  };

  const scheduleClose = (): void => {
    if (pinned) return;
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => open(null), CLOSE_DELAY_MS);
  };

  const insideChrome = (node: Node | null): boolean => {
    if (!node) return false;
    if (header?.contains(node)) return true;
    return Array.from(panels.values()).some((p) => p.contains(node));
  };

  triggers.forEach((trigger) => {
    const key = trigger.dataset.mega;
    if (!key) return;
    trigger.addEventListener('mouseenter', () => open(key));
    trigger.addEventListener('mouseleave', scheduleClose);
    trigger.addEventListener('focus', () => open(key));
    trigger.addEventListener('click', (e) => {
      const href = trigger.getAttribute('href') ?? '';
      const hash = href.includes('#') ? `#${href.split('#')[1] ?? ''}` : '';
      const target = hash.length > 1 ? document.querySelector(hash) : null;
      if (!target) return;
      e.preventDefault();
      // Toggle a pinned desktop panel closed; on mobile never pin (the slide-out nav owns the UI).
      if (!isMobile() && openKey === key && pinned) { open(null); return; }
      if (isMobile()) open(null);
      else open(key, { pin: true });
      suppressScrollClose = true;
      const clearSuppress = (): void => { suppressScrollClose = false; };
      window.addEventListener('scrollend', clearSuppress, { once: true });
      window.setTimeout(clearSuppress, SCROLL_SUPPRESS_MS);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener('mouseenter', () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    });
    panel.addEventListener('mouseleave', scheduleClose);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openKey) open(null); });
  document.addEventListener('click', (e) => { if (openKey && !insideChrome(e.target as Node)) open(null); });
  document.addEventListener('focusin', (e) => { if (openKey && !insideChrome(e.target as Node)) open(null); });
  window.addEventListener('scroll', () => {
    if (!openKey || suppressScrollClose) return;
    open(null);
  }, { passive: true });
};
