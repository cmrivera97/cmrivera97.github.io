export const initSmoothScroll = (): void => {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const anchor = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
    if (!anchor || anchor.hasAttribute('data-mega')) return;
    const href = anchor.getAttribute('href') ?? '';
    const idx = href.indexOf('#');
    if (idx < 0) return;
    const path = href.slice(0, idx);
    const hash = href.slice(idx);
    if (path && !path.endsWith(window.location.pathname)) return;
    if (hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', hash);
  });
};
