/** @type {import('tailwindcss').Config} */

// Every brand color resolves through a CSS variable (defined per theme in
// src/lib/themes.js and applied as a NativeWind vars() style on the root
// wrapper). So `bg-cream-50` / `text-stone-900` automatically restyle when the
// theme flips light → dark → neon — no `dark:` variants in components. This
// mirrors the web app's tailwind.config.js + index.css exactly.
// The `<alpha-value>` slot keeps opacity modifiers (bg-cream-50/80) working.
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // See notes: font-serif is kept pointing at Nunito so the existing
      // font-serif heading usages need no rename (Nunito is a rounded sans).
      fontFamily: {
        sans: ['NunitoSans_400Regular', 'system-ui', 'sans-serif'],
        serif: ['Nunito_700Bold', 'system-ui', 'sans-serif'],
        display: ['Nunito_700Bold', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Themed (flip with light/dark/neon via CSS vars) ──────────────────
        cream: {
          50: v('cream-50'), 100: v('cream-100'), 200: v('cream-200'),
          300: v('cream-300'), 400: v('cream-400'), 500: v('cream-500'), 600: v('cream-600'),
        },
        clay: { 500: v('clay-500'), 600: v('clay-600'), 700: v('clay-700') },
        blush: {
          50: v('blush-50'), 100: v('blush-100'), 200: v('blush-200'),
          300: v('blush-300'), 400: v('blush-400'), 500: v('blush-500'),
        },
        seafoam: {
          50: v('seafoam-50'), 100: v('seafoam-100'), 200: v('seafoam-200'),
          300: v('seafoam-300'), 400: v('seafoam-400'), 500: v('seafoam-500'),
        },
        ocean: {
          50: v('ocean-50'), 100: v('ocean-100'), 200: v('ocean-200'), 300: v('ocean-300'),
          400: v('ocean-400'), 500: v('ocean-500'), 600: v('ocean-600'), 700: v('ocean-700'),
        },
        stone: {
          50: v('stone-50'), 100: v('stone-100'), 200: v('stone-200'), 300: v('stone-300'),
          400: v('stone-400'), 500: v('stone-500'), 600: v('stone-600'), 700: v('stone-700'),
          800: v('stone-800'), 900: v('stone-900'),
        },
        // Named for MEANING, not hue (they invert in dark/neon) — matches web.
        success: { 50: v('success-50'), 200: v('success-200'), 500: v('success-500'), 700: v('success-700'), 900: v('success-900') },
        danger: { 50: v('danger-50'), 200: v('danger-200'), 500: v('danger-500'), 700: v('danger-700'), 900: v('danger-900') },

        // Existing screens use `emerald`/`red` by literal name (quiz right/wrong,
        // flashcard, practice feedback). Alias them onto the THEMED success/danger
        // tokens so they invert in dark/neon like everything else. The shades
        // emerald/red use but success/danger don't (100, 800) map to the nearest
        // themed step. `orange` (streak/BetaRibbon) now has its own themed tokens.
        emerald: {
          50: v('success-50'), 100: v('success-200'), 200: v('success-200'),
          500: v('success-500'), 700: v('success-700'), 800: v('success-900'), 900: v('success-900'),
        },
        red: {
          50: v('danger-50'), 100: v('danger-200'), 200: v('danger-200'),
          500: v('danger-500'), 700: v('danger-700'), 900: v('danger-900'),
        },
        orange: { 200: v('orange-200'), 900: v('orange-900') },
      },
      boxShadow: {
        warm: '0 4px 14px -2px rgba(120, 80, 40, 0.12), 0 2px 4px -2px rgba(120, 80, 40, 0.08)',
      },
      // Softer, consistent roundrects on all the cards/boxes (rounded-md is the
      // shared box radius across the app) — gentler than the old 6px, but not
      // pill-round. Plus a bolder default border so boxes read as defined.
      borderRadius: {
        md: '0.625rem',   // ~10px (was 6px) — the app-wide card corner
        lg: '0.875rem',   // ~14px
        xl: '1.125rem',   // ~18px
      },
      borderWidth: {
        DEFAULT: '2px',   // bolder borders everywhere `border` is used
      },
    },
  },
  plugins: [],
}
