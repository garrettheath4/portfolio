import { describe, expect, it } from 'vitest';
import en from './en.json';
import nl from './nl.json';
import de from './de.json';

// Collects every dot-path that resolves to a string leaf, e.g. "nav.start".
function collectKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [prefix];
  }
  return Object.entries(obj).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key)
  );
}

const locales: Record<string, unknown> = { en, nl, de };
const keysByLocale = Object.fromEntries(
  Object.entries(locales).map(([locale, translations]) => [locale, new Set(collectKeys(translations))])
);

describe('translation key parity', () => {
  const localeNames = Object.keys(locales);

  for (const locale of localeNames.filter((l) => l !== 'en')) {
    it(`${locale}.json has no keys missing from en.json`, () => {
      const missing = [...keysByLocale.en].filter((key) => !keysByLocale[locale].has(key));
      expect(missing).toEqual([]);
    });

    it(`${locale}.json has no extra keys not present in en.json`, () => {
      const extra = [...keysByLocale[locale]].filter((key) => !keysByLocale.en.has(key));
      expect(extra).toEqual([]);
    });
  }

  it('every translation value is a non-empty string', () => {
    for (const [locale, keys] of Object.entries(keysByLocale)) {
      for (const key of keys) {
        const value = key.split('.').reduce((obj: any, part) => obj?.[part], locales[locale]);
        expect(typeof value, `${locale}.${key} should be a string`).toBe('string');
        expect(value.length, `${locale}.${key} should not be empty`).toBeGreaterThan(0);
      }
    }
  });
});
