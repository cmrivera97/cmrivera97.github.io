// types
import type { Lang } from '../i18n/getT';

const ensureLeadingSlash = (path: string): string => (path.startsWith('/') ? path : `/${path}`);

const stripTrailingSlashes = (path: string): string => path.replace(/\/+$/u, '');

export const localizedHref = (lang: Lang, path: string): string => {
  const normalized = ensureLeadingSlash(path);
  const base = stripTrailingSlashes(import.meta.env.BASE_URL);
  const localePrefix = lang === 'es' ? '/es' : '';
  const composed = `${base}${localePrefix}${normalized}`;
  return composed.endsWith('/') ? composed : `${composed}/`;
};
