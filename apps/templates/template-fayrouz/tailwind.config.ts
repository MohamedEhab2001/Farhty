import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF5EE',
        espresso: '#2C1A0E',
        gold: '#C9A96E',
        blush: '#F0D5C0',
        cream: '#FDF8F2',
        mahogany: '#6B3F2A',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        naskh: ['Noto Naskh Arabic', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
