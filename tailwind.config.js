/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f7f4fa',
          100: '#ede8f3',
          200: '#dbd1e7',
          300: '#c1add3',
          400: '#a582bb',
          500: '#8b5ca3',
          600: '#744089',
          700: '#57068C', // NYU purple
          800: '#4a1b73',
          900: '#3e1b5c',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};