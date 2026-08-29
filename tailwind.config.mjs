/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1590FF', // primary accent
        secondary: '#102039', // secondary accent (Dark Navy)
        highlightBlue: '#4AC1FF', // highlight blue (Cyan-Edge)
        neutral: {
          bg: '#F5F8FC', // neutral surface light
          dark: '#0D1117', // Contrast-BG (Dark Mode)
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'h1': 'clamp(3rem, 5vw, 4.5rem)',
        'h2': 'clamp(2.25rem, 4vw, 3rem)',
        'body': 'clamp(1rem, 1.125vw, 1.125rem)',
      },
      maxWidth: {
        'container': '1280px',
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        'gutter': '24px',
      },
      boxShadow: {
        'button': '0 4px 12px 0 rgba(10,132,255,0.25)', // Updated button shadow
      },
      transitionProperty: {
        'transform': 'transform',
      },
      backgroundImage: {
        // Renamed to akzentGradient as per new concept, assuming this replaces the old gradient-highlight
        'akzentGradient': 'linear-gradient(180deg, #0A84FF 0%, #4AC1FF 100%)',
      },
    },
    screens: {
      'sm': '600px',
      'md': '960px',
      'lg': '1280px',
    },
  },
  plugins: [],
};
