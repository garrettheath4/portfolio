# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal portfolio website (garrettheath4.com) built with Astro + Tailwind CSS + Preact, based on the
`astro-multilingual-portfolio-template`. Static site output, deployed via Netlify (see `netlify.toml`).

## Commands

```shell
npm run dev       # start dev server at http://localhost:4321
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run astro     # pass-through to the Astro CLI (e.g. npm run astro check)
```

There is no test suite or linter configured in this repo.

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
