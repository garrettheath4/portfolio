import { describe, expect, it } from 'vitest';
import { stripLocalePrefix } from './localeUrl';

describe('stripLocalePrefix', () => {
  it('strips a matching locale prefix from the start of the path', () => {
    expect(stripLocalePrefix('/de/imprint/', 'de')).toBe('/imprint/');
  });

  it('returns the root path when the whole path is the locale segment', () => {
    expect(stripLocalePrefix('/nl/', 'nl')).toBe('/');
  });

  it('leaves the path unchanged when the locale is not undefined but not present in the path', () => {
    expect(stripLocalePrefix('/imprint/', 'de')).toBe('/imprint/');
  });

  it('leaves the path unchanged when currentLocale is undefined (unprefixed default locale)', () => {
    expect(stripLocalePrefix('/imprint/', undefined)).toBe('/imprint/');
  });

  it('only removes the first occurrence of the locale segment', () => {
    // A page path that happens to contain the locale code again later
    // should not have that second occurrence stripped.
    expect(stripLocalePrefix('/de/de-review/', 'de')).toBe('/de-review/');
  });
});
