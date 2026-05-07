import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'blush-50': '#FDF2F4',
        'blush-100': '#FCE7EB',
        'blush-200': '#F9CFD8',
        'blush-300': '#F4A8BA',
        'blush-400': '#E87A99',
        'blush-500': '#D4627F',
        'blush-600': '#B84464',
        cream: '#FDF8F2',
        ivory: '#FFF9F5',
        'warm-white': '#FEFAF6',
        rose: '#D4627F',
        'rose-light': '#E8A0B4',
        'rose-dark': '#B84464',
        'soft-pink': '#F5D5DE',
        'deep-rose': '#8B2252',
        'warm-gray': '#8A7E76',
        'warm-dark': '#3C2A2A',
        'warm-charcoal': '#4A3535',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        'aref-ruqaa': ['Aref Ruqaa', 'serif'],
      },
      animation: {
        'pink-shimmer': 'pinkShimmer 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'petal-fall': 'petalFall var(--duration, 10s) var(--delay, 0s) linear infinite',
      },
      keyframes: {
        pinkShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(-5px) rotate(-2deg)' },
          '50%': { transform: 'translateY(5px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        petalFall: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10vh) rotate(0deg) translateX(0)',
          },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.5' },
          '100%': {
            opacity: '0',
            transform: 'translateY(100vh) rotate(360deg) translateX(80px)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config