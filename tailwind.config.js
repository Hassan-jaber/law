/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Cairo', 'system-ui', 'sans-serif'],
        display: ['Cairo', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#050914',
          900: '#080e1f',
          800: '#0c1630',
          700: '#12203f',
        },
        gold: {
          200: '#f1e2b4',
          300: '#e6cf8d',
          400: '#d9b95f',
          500: '#c9a24b',
          600: '#a88232',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(201,162,75,0.45)',
      },
    },
  },
  plugins: [],
}
