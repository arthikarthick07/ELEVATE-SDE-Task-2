/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#d9e2f1',
          200: '#b3c5e3',
          300: '#7e9bce',
          400: '#4a6fb0',
          500: '#2c4d8a',
          600: '#1f3a6e',
          700: '#16294f',
          800: '#0f1d3a',
          900: '#0a1530',
          950: '#060d20',
        },
        gold: {
          50: '#fdf9ec',
          100: '#faf0cc',
          200: '#f4df95',
          300: '#edc857',
          400: '#e4b432',
          500: '#c9961f',
          600: '#a47417',
          700: '#7e5715',
          800: '#634617',
          900: '#543b18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(15, 29, 58, 0.08), 0 4px 24px -4px rgba(15, 29, 58, 0.06)',
        'card-hover': '0 8px 28px -6px rgba(15, 29, 58, 0.16), 0 2px 8px -2px rgba(15, 29, 58, 0.08)',
        gold: '0 4px 14px -2px rgba(228, 180, 50, 0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
