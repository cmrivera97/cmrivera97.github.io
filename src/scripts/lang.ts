// Runtime locale-swap for the LangToggle island. Mirrors utils/localizedHref.ts
// and assumes astro.config.mjs sets `trailingSlash: 'always'` — if that ever
// changes, the click-time swap and the SSR-time href helper will diverge.
// Lang is duplicated here (not imported from i18n/getT) to keep the island
// bundle self-contained and free of the i18n dictionaries.

type Lang = 'en' | 'es';

const isLang = (value: unknown): value is Lang => value === 'en' || value === 'es';

const stripBase = (pathname: string, base: string): string => {
  if (base === '' || base === '/') return pathname;
  const normalizedBase = base.replace(/\/+$/u, '');
  return pathname.startsWith(normalizedBase) ? pathname.slice(normalizedBase.length) : pathname;
};

const swapLocale = (pathname: string, base: string, target: Lang): string => {
  const stripped = stripBase(pathname, base);
  const withoutEs = stripped.replace(/^\/es(\/|$)/u, '/');
  const next = target === 'es' ? `/es${withoutEs === '/' ? '/' : withoutEs}` : withoutEs;
  const joined = `${base.replace(/\/+$/u, '')}${next}`;
  return joined.endsWith('/') ? joined : `${joined}/`;
};

export const initLangToggle = (root: HTMLElement, base: string, currentLang: Lang): void => {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-lang-button]');
  buttons.forEach((btn) => {
    const value = btn.dataset.langButton;
    btn.setAttribute('aria-pressed', value === currentLang ? 'true' : 'false');
    btn.addEventListener('click', () => {
      const next = btn.dataset.langButton;
      if (isLang(next) && next !== currentLang) {
        const target = swapLocale(window.location.pathname, base, next);
        window.location.assign(target);
      }
    });
  });
};
