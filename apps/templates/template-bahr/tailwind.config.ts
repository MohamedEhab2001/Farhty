import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sea: { light: '#7fb8d4', DEFAULT: '#4a7fa5', deep: '#1e4d6b' },
        sand: '#f5ede0',
        gold: { light: '#e0c880', DEFAULT: '#c8a96e', dark: '#a08040' },
        ivory: '#faf7f2',
      },
      fontFamily: {
        body:    ['Poppins', 'sans-serif'],
        arabic:  ['Amiri', 'serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        float:      'float 6s ease-in-out infinite',
        shimmer:    'shimmer 3s ease-in-out infinite',
        'fade-up':  'fadeUp 1.2s ease-out both',
        'heart-fall': 'heartFall linear infinite',
      },
      keyframes: {
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        heartFall: {
          '0%':   { transform: 'translateY(-5vh) rotate(0deg)',   opacity: '0' },
          '10%':  { opacity: '0.85' },
          '85%':  { opacity: '0.6' },
          '100%': { transform: 'translateY(108vh) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
