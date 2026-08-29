// Strips the current locale's path segment (e.g. "/de") from a pathname so
// it can be re-prefixed for a different locale, e.g. by astro:i18n's
// getRelativeLocaleUrl(). Only the first occurrence is removed, matching
// String.prototype.replace's default (non-global) behavior.
export function stripLocalePrefix(pathname: string, currentLocale: string | undefined): string {
  if (!currentLocale) {
    return pathname;
  }
  return pathname.replace(`/${currentLocale}`, '');
}
