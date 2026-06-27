import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // NOVYR luxury dark palette
        ink: {
          DEFAULT: '#08080A', // near-black page background
          900: '#0A0A0C',
          800: '#101014',
          700: '#16161B',
          600: '#1C1C22',
          500: '#26262E',
        },
        charcoal: {
          DEFAULT: '#1A1A1F',
          light: '#2A2A31',
          border: '#2E2E37',
        },
        electric: {
          // Electric blue — the brand accent
          DEFAULT: '#2E6BFF',
          50: '#EAF1FF',
          100: '#D6E4FF',
          300: '#7FA6FF',
          400: '#4F86FF',
          500: '#2E6BFF',
          600: '#1A52E0',
          700: '#1340B8',
        },
        smoke: {
          DEFAULT: '#A1A1AA',
          light: '#D4D4D8',
          dark: '#71717A',
        },
        // Warm off-white — the luxury neutral that replaces bright accents
        bone: {
          DEFAULT: '#E7E4DD',
          dark: '#B7B4AC',
        },
        concrete: {
          DEFAULT: '#8C8A85',
          dark: '#4B4B49',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'sans-serif'],
        poster: ['var(--font-poster)', 'var(--font-display)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 9vw, 8rem)', { lineHeight: '0.92', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        // Billboard poster scale (Anton)
        'poster-xl': ['clamp(3.5rem, 14vw, 12rem)', { lineHeight: '0.84', letterSpacing: '0.01em' }],
        'poster-lg': ['clamp(2.75rem, 9vw, 7rem)', { lineHeight: '0.86', letterSpacing: '0.01em' }],
        'poster-md': ['clamp(2.25rem, 6vw, 4.5rem)', { lineHeight: '0.9', letterSpacing: '0.01em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest: '0.25em',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(46, 107, 255, 0.55)',
        'glow-sm': '0 0 20px -6px rgba(46, 107, 255, 0.45)',
        card: '0 10px 40px -12px rgba(0, 0, 0, 0.7)',
        'lift': '0 24px 60px -20px rgba(0, 0, 0, 0.85)',
      },
      backgroundImage: {
        'grid': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px -6px rgba(46,107,255,0.45)' },
          '50%': { boxShadow: '0 0 30px -2px rgba(46,107,255,0.7)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 28s linear infinite',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

export default config;
