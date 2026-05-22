export const initMobileNav = (): void => {
  if (typeof document === 'undefined') return;
  const burger = document.querySelector<HTMLButtonElement>('[data-nav-burger]');
  const nav = document.getElementById('nav-center');
  if (!burger || !nav) return;

  const setOpen = (open: boolean): void => {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-mobile-open', open);
    document.body.classList.toggle('nav-locked', open);
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
};
