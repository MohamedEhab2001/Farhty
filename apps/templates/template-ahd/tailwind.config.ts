import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FDFAF4',
        'warm-white': '#F8F4EC',
        champagne: '#F5E6C8',
        gold: '#C4A35A',
        'gold-light': '#D4B870',
        'gold-dark': '#9E7C38',
        navy: '#1E2B3A',
        'navy-light': '#2D3F52',
        charcoal: '#3C3C3C',
        'warm-gray': '#8A8078',
      },
      fontFamily: {
        amiri:    ['Amiri', 'serif'],
        tajawal:  ['Tajawal', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        'cormorant-sc': ['"Cormorant SC"', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
