# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal portfolio website (garrettheath4.com) built with Astro + Tailwind CSS + Preact, based on the
`astro-multilingual-portfolio-template`. Static site output, deployed via Netlify (see `netlify.toml`).

## Commands

```shell
npm run dev        # start dev server at http://localhost:4321
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run astro      # pass-through to the Astro CLI (e.g. npm run astro check)
npm test           # run the Vitest unit test suite once
npm run test:watch # run Vitest in watch mode
npm run lint       # astro check && eslint . — type/template diagnostics plus ESLint
```

Node version is pinned in `.nvmrc` (currently `24.20.0`) and kept in sync across local dev, GitHub Actions
CI, and Netlify's build environment (`netlify.toml`'s `[build.environment]`).

A `simple-git-hooks` pre-commit hook (configured under `"simple-git-hooks"` in `package.json`, installed via
the `prepare` script) runs `npm run lint && npm test` before every commit. `.github/workflows/test.yml` runs
the same two commands in CI on every push and pull request as a backstop.

### Linting

`npm run lint` runs two checks: `astro check` (Astro/TypeScript diagnostics, including `.astro` template
type-checking) and `eslint .` (config in `eslint.config.js`, using `typescript-eslint` and
`eslint-plugin-astro`). Both must pass with zero errors.

### Unit tests

Vitest covers the pure-logic utilities (`*.test.ts` files live next to the module they test):

- `src/utils/i18n.test.ts` — `t()`/`getTranslations()` key lookup and fallback behavior.
- `src/i18n/parity.test.ts` — asserts `en.json`, `nl.json`, `de.json` all expose the same set of keys, so a
  translation added in one language isn't silently missing from another.
- `src/utils/localeUrl.test.ts` — tests `stripLocalePrefix()`, a pure helper extracted from
  `LanguageSwitcher.astro` (which also depends on `astro:i18n`'s `getRelativeLocaleUrl`, a virtual module
  that isn't available outside an Astro build, hence the extraction).
- `src/utils/me.test.ts` — checks the *shape* of the decoded email/address (regex/length checks only).
  **Never assert the actual decoded values in a test** — the whole point of Base64-encoding that data in
  `me.ts` is to keep it out of the repo's plaintext source, and a test with the real values would defeat
  that.

## Architecture

### i18n / routing

Locales are English (`en`), Dutch (`nl`), and German (`de`), configured in `astro.config.mjs` with
`prefixDefaultLocale: false` — English routes are unprefixed (`/`, `/imprint/`), while Dutch and German are
prefixed (`/nl/...`, `/de/...`).

- `src/i18n/en.json`, `nl.json`, `de.json` hold all page text as nested JSON. `src/utils/i18n.ts` exports
  `t(key, lang)` (dot-path lookup, e.g. `t('nav.start', lang)`, falls back to English then to the raw key) and
  `getTranslations(lang)`.
- Routes are duplicated in two places that must both exist and stay in sync:
  - `src/pages/index.astro`, `imprint.astro`, `privacy-policy.astro` — serve the default locale at the
    unprefixed path, using `Astro.currentLocale`.
  - `src/pages/[lang]/index.astro`, `imprint.astro`, `privacy-policy.astro` — use `getStaticPaths()` to
    generate `/en/`, `/nl/`, `/de/` explicitly.
  - Both sets just forward a `lang` prop into the same component under `src/components/pages/`
    (`IndexPage.astro`, `ImprintPage.astro`, etc.), which composes layout + sections. Add new pages by
    creating a `*Page.astro` component and wiring it into both route locations.
- `src/components/ui/LanguageSwitcher.astro` currently only lists `['en', 'nl']` in its `locales` array —
  German is intentionally missing from the switcher even though it's a fully supported locale elsewhere.
- When adding a new page, translation key, or locale, update all three JSON files together — `t()` warns at
  runtime (via `console.warn`) on missing keys but won't fail the build.

### Page composition

- `src/layouts/Layout.astro` is the shared HTML shell: head/meta/OG/Twitter/JSON-LD tags, Navbar, Footer,
  global AOS/GSAP script includes, dark-mode support via `color-scheme`/`darkreader-lock`.
- `src/components/pages/*Page.astro` assemble a page from `src/components/sections/*.astro` (Hero, Values,
  Skills, Projects, Timeline, Contact, FooterCTA, Footer) and pass `lang` down to each.
- `src/components/layout/Legal.astro` is a shared wrapper for the legal pages (Imprint, Privacy Policy),
  handling title/description composition and prose styling.
- Note: `Projects` is currently commented out in `IndexPage.astro`.

### Personal/contact info

`src/utils/me.ts` holds name, social links, and contact details. Email/phone/address are Base64-encoded in
source to obfuscate them from scrapers (decoded at runtime via `atob()`); see the comments in that file for
how to re-encode when updating them.

### Animations & theming

- `src/scripts/animations.js` and AOS (Animate On Scroll, loaded from CDN in `Layout.astro`) drive scroll
  animations; GSAP + ScrollTrigger are also loaded from CDN.
- `src/scripts/theme-toggle.js` (imported by `ThemeToggle.astro`) handles dark/light mode toggling;
  `src/scripts/theme.js` is legacy/unused (superseded by `theme-toggle.js`, left commented out in `Layout.astro`).

### Styling

Tailwind CSS with a custom theme in `tailwind.config.mjs` (colors, fonts). Global styles in
`src/styles/global.css`. React/Preact interop is configured via `overrides` in `package.json` (`react` and
`react-dom` are aliased to `@preact/compat`) plus the `@astrojs/preact` integration with `compat: true`.
