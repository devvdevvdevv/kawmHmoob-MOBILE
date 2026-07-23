/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Lora', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#FBF6EC',
          100: '#F5EBD9',
          200: '#ECDCC0',
          300: '#E0C8A0',
          400: '#D9B38C',
          500: '#C99A6F',
          600: '#A87A52',
        },
        clay: {
          100: '#F1DAD0',
          300: '#D88E72',
          500: '#B25E3D',
          600: '#9C4F33',
          700: '#7E3F28',
          800: '#5C2D1C',
        },
        blush: {
          50: '#FCEEEB',
          100: '#F8DBD5',
          200: '#B0E0E6',
          300: '#E8A39B',
          400: '#D88278',
          500: '#C26358',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#EF4444',
          700: '#B91C1C',
          900: '#7F1D1D',
        },
        orange: {
          200: '#FED7AA',
          900: '#7C2D12',
        },
      },
      boxShadow: {
        warm: '0 4px 14px -2px rgba(120, 80, 40, 0.12), 0 2px 4px -2px rgba(120, 80, 40, 0.08)',
      },
    },
  },
  plugins: [],
}
