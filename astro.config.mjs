import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://max-example.de/', // You should update this to your actual site URL
  output: 'static',
  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false, // German pages won't have /de/, English will have /en/
    },
  },

  // Integrations
  integrations: [tailwind(), sitemap(), compress({
    css: true,
    html: true,
    js: true,
    img: {
      quality: 80,
    },
    svg: true,
    logger: 1,
  }), preact({
    compat: true
  })],

  // Built-in image optimization settings
  // Removed image service config as sharp is not a direct project dependency
  // image: {
  //   service: {
  //     entrypoint: 'astro/assets/services/sharp'
  //   }
  // },

  vite: {
    clearScreen: false,

    build: {
      cssCodeSplit: true
    },
    ssr: {
      external: ['aos']
    }
  },

  // Add cache headers for static assets
  headers: {
    '/_astro/*': [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ],
    '/assets/*': [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ],
    '/*.css': [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ],
    '/*.js': [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ],
    '/*.webp': [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ]
  }
});
