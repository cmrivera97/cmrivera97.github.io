const stringHash = (s: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};

export const hueFromSlug = (slug: string): number => {
  const h = stringHash(slug);
  return 200 + (h % 121);
};

export const seedFromSlug = (slug: string): number => stringHash(slug);
