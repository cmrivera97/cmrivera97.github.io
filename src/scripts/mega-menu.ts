export const initMegaMenu = (): void => {
  if (typeof document === 'undefined') return;
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-mega]'));
  const panels = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-mega-panel]').forEach((p) => {
    const key = p.dataset.megaPanel;
    if (key) panels.set(key, p);
  });
  let openKey: string | null = null;
  const open = (key: string | null): void => {
    openKey = key;
    panels.forEach((panel, k) => { if (k === key) panel.setAttribute('data-open', ''); else panel.removeAttribute('data-open'); });
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(trigger.dataset.mega === key)));
  };
  triggers.forEach((trigger) => {
    const key = trigger.dataset.mega;
    if (!key) return;
    trigger.addEventListener('mouseenter', () => open(key));
    trigger.addEventListener('focus', () => open(key));
  });
  panels.forEach((panel) => panel.addEventListener('mouseleave', () => open(null)));
  const header = document.querySelector('.site-header');
  header?.addEventListener('mouseleave', () => open(null));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openKey) open(null); });
};
