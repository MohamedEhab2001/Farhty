import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF8F6',
          100: '#FFE8E8',
          200: '#F5D0D0',
          300: '#E8B4B4',
          400: '#D4A0A0',
          500: '#C08888',
          600: '#A06E6E',
          700: '#7A5050',
          800: '#5C3A3A',
          900: '#4A3535',
        },
        rose: {
          gold: '#C69B7B',
          accent: '#D4A0A0',
        },
        ivory: '#FFF8F6',
        sage: '#B8A99A',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config