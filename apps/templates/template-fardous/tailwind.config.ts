import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:       '#F7F3E9',
        ink:         '#1A1A2E',
        gold:        '#B8962E',
        'gold-soft': '#D4B870',
        'gold-deep': '#8C6E1A',
        emerald:     '#2D6A4F',
        'emerald-deep': '#1A4030',
      },
      fontFamily: {
        display: ['Amiri', '"Reem Kufi"', 'serif'],
        arabic:  ['Amiri', '"Reem Kufi"', 'serif'],
        body:    ['Tajawal', 'sans-serif'],
      },
      keyframes: {
        shimmer:    { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        floatSlow:  { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-12px) rotate(2deg)' } },
        pulseRing:  { '0%': { transform: 'scale(1)', opacity: '0.7' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        spinSlow:   { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        kenBurns:   { '0%': { transform: 'scale(1) translate(0,0)' }, '50%': { transform: 'scale(1.08) translate(-1%,-1%)' }, '100%': { transform: 'scale(1) translate(0,0)' } },
        sparkle:    { '0%,100%': { opacity: '0', transform: 'scale(0.6)' }, '50%': { opacity: '1', transform: 'scale(1)' } },
        driftUp:    { '0%': { transform: 'translateY(20vh) translateX(0)', opacity: '0' }, '10%': { opacity: '0.9' }, '90%': { opacity: '0.7' }, '100%': { transform: 'translateY(-110vh) translateX(20px)', opacity: '0' } },
        goldSweep:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        revealUp:   { '0%': { opacity: '0', transform: 'translateY(40px)', filter: 'blur(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' } },
      },
      animation: {
        shimmer:    'shimmer 3s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'spin-slow': 'spinSlow 40s linear infinite',
        'ken-burns': 'kenBurns 22s ease-in-out infinite',
        sparkle:    'sparkle 3s ease-in-out infinite',
        'drift-up': 'driftUp linear infinite',
        'reveal-up': 'revealUp 1.2s cubic-bezier(0.2,0.8,0.2,1) both',
        'gold-sweep': 'goldSweep 4s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
