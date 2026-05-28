const BASE = import.meta.env.BASE_URL;

export const withBase = (path: string): string => {
  const trimmed = path.replace(/^\/+/, '');
  return `${BASE}${trimmed}`;
};
