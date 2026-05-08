// types
import type { Lang } from '../i18n/getT';

// Both this helper and the runtime swapLocale in scripts/lang.ts assume
// astro.config.mjs sets `trailingSlash: 'always'`. If that ever changes,
// the SSR-time hrefs and the click-time path swap will diverge.

const ensureLeadingSlash = (path: string): string => (path.startsWith('/') ? path : `/${path}`);

const stripTrailingSlashes = (path: string): string => path.replace(/\/+$/u, '');

export const localizedHref = (lang: Lang, path: string): string => {
  const normalized = ensureLeadingSlash(path);
  const base = stripTrailingSlashes(import.meta.env.BASE_URL);
  const localePrefix = lang === 'es' ? '/es' : '';
  const composed = `${base}${localePrefix}${normalized}`;
  return composed.endsWith('/') ? composed : `${composed}/`;
};
