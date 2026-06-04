// packages
import enStrings from './en.json';
import esStrings from './es.json';

export type Lang = 'en' | 'es';

export type Translations = typeof enStrings;

const dictionaries: Record<Lang, Translations> = {
  en: enStrings,
  es: esStrings as Translations,
};

type Path<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never }[keyof T]
  : never;

export type TKey = Path<Translations>;

const resolve = (dict: Translations, key: TKey): string => {
  const result = key.split('.').reduce<unknown>((cursor, segment) => {
    if (cursor !== null && typeof cursor === 'object' && segment in (cursor as Record<string, unknown>)) {
      return (cursor as Record<string, unknown>)[segment];
    }
    throw new Error(`i18n: missing key "${key}"`);
  }, dict);
  if (typeof result !== 'string') {
    throw new Error(`i18n: key "${key}" did not resolve to a string`);
  }
  return result;
};

export const getT = (lang: Lang): ((key: TKey) => string) => {
  const dict = dictionaries[lang];
  return (key: TKey): string => resolve(dict, key);
};
