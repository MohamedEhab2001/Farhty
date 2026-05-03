import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#f5eadb',
          300: '#ecdcc6',
          400: '#dfc7a0',
          500: '#c9a96e',
          600: '#b08d4f',
          700: '#8e6e3a',
          800: '#6b5229',
          900: '#4a3818',
        },
        champagne: {
          DEFAULT: '#f7e7ce',
          dark: '#e8d4b0',
          light: '#fdf5ea',
        },
        gold: {
          light: '#e8d5a3',
          DEFAULT: '#c9a96e',
          dark: '#a88a4e',
        },
      },
      fontFamily: {
        display: ['Amiri', 'serif'],
        body: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config