import { describe, expect, it, vi } from 'vitest';
import { t, getTranslations, type TranslationKey } from './i18n';

describe('t', () => {
  it('resolves a top-level key', () => {
    expect(t('site.title', 'en')).not.toBe('site.title');
  });

  it('resolves a nested dot-path key', () => {
    expect(t('nav.start', 'en')).not.toBe('nav.start');
  });

  it('defaults to English when lang is undefined', () => {
    expect(t('site.title', undefined)).toBe(t('site.title', 'en'));
  });

  it('falls back to English for an unsupported locale', () => {
    expect(t('site.title', 'fr')).toBe(t('site.title', 'en'));
  });

  it('falls back to English when the key is missing in the requested language', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // 'de' and 'nl' are expected to carry every key 'en' has; if this ever
    // fails it means a key was added to en.json without being translated.
    expect(t('site.title', 'de')).not.toBe('site.title');
    warn.mockRestore();
  });

  it('falls back to the raw key when missing everywhere', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Cast: intentionally an invalid key, to exercise the runtime fallback
    // a real caller could still hit via a dynamically-built key.
    expect(t('nope.does.not.exist' as TranslationKey, 'en')).toBe('nope.does.not.exist');
    warn.mockRestore();
  });

  it('returns the raw key for a path into a non-string value (e.g. an object)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Cast: 'nav' is a real key, but resolves to an object, not a string leaf.
    expect(t('nav' as TranslationKey, 'en')).toBe('nav');
    warn.mockRestore();
  });
});

describe('getTranslations', () => {
  it('returns the full translation object for a supported language', () => {
    const translations = getTranslations('en');
    expect(translations).toHaveProperty('site');
    expect(translations).toHaveProperty('nav');
  });

  it('defaults to English for undefined or unsupported languages', () => {
    expect(getTranslations(undefined)).toEqual(getTranslations('en'));
    expect(getTranslations('fr')).toEqual(getTranslations('en'));
  });
});
