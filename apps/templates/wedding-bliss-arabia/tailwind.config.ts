import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F5F0E8',
        gold: 'oklch(0.74 0.13 80)',
        'gold-deep': 'oklch(0.58 0.14 70)',
        emerald: 'oklch(0.32 0.07 155)',
        'emerald-deep': 'oklch(0.22 0.06 155)',
        'emerald-darkest': 'oklch(0.18 0.05 155)',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        kufi: ['Reem Kufi', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
