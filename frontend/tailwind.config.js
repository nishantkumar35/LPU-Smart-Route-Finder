/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Warmer navy dark palette — subtle blue-warmth instead of cold black
        dark: {
          950: '#08091a',
          900: '#0b0d1f',
          850: '#0f1228',
          800: '#131729',
          750: '#192035',
          700: '#1e283f',
          600: '#28364f',
        },
        // Brand: warm amber instead of cold indigo
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Secondary accent — teal/cyan for variety
        teal: {
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':   'slideUp 0.2s ease-out',
        'shimmer':    'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn:   { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'subtle':      '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
        'panel':       '0 4px 24px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        'dropdown':    '0 12px 40px -8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.06)',
        'glow-amber':  '0 0 24px rgba(245, 158, 11, 0.3), 0 0 8px rgba(245, 158, 11, 0.15)',
        'glow-teal':   '0 0 24px rgba(20, 184, 166, 0.25)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-amber/60': '0 0 16px rgba(245, 158, 11, 0.2)',
      },
    },
  },
  plugins: [],
}
