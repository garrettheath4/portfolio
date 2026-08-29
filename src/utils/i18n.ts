import enTranslations from '../i18n/en.json';
import nlTranslations from '../i18n/nl.json';
import deTranslations from '../i18n/de.json';

const translations = {
  en: enTranslations,
  nl: nlTranslations,
  de: deTranslations,
};

// Union of every dot-path leading to a string leaf, e.g. "nav.start" or "site.title".
type DotPaths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
    }[keyof T & string];

export type TranslationKey = DotPaths<typeof enTranslations>;

// Helper function to safely access nested keys like "nav.start"
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function t(key: TranslationKey, lang: string | undefined): string {
  const currentLang = lang || 'en'; // Default to 'en' if lang is undefined
  const langTranslations = translations[currentLang as keyof typeof translations] || translations.en;

  const value = getNestedValue(langTranslations, key);

  if (value === undefined) {
    console.warn(`Translation key "${key}" not found for language "${currentLang}". Falling back to key.`);
    // Fallback to trying the default language if not already trying it
    if (currentLang !== 'en') {
      const fallbackValue = getNestedValue(translations.en, key);
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
    }
    return key; // Return the key itself as a last resort
  }
  return value;
}

// Utility to get all translations for a specific language, useful for passing to components
export function getTranslations(lang: string | undefined) {
  const currentLang = lang || 'en';
  return translations[currentLang as keyof typeof translations] || translations.en;
}
