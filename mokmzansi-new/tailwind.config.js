/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colors extracted from the logo (gradient from pink to yellow, and purple to teal)
        'primary': {
          100: '#fdf2f6',
          200: '#fce7ed',
          300: '#f9d0dc',
          400: '#f7a9c3',
          500: '#f67aa4', // Pink from logo
          600: '#e45891',
          700: '#bf3b7a',
          800: '#9e316b',
          900: '#832b5c',
        },
        'secondary': {
          100: '#fff7e6',
          200: '#ffefc3',
          300: '#ffe49a',
          400: '#ffd671',
          500: '#ffc847', // Yellow/orange from logo
          600: '#e6a82f',
          700: '#cc8f17',
          800: '#b37700',
          900: '#996600',
        },
        'accent': {
          100: '#f5f3ff',
          200: '#ebe8ff',
          300: '#d9d3ff',
          400: '#b4a7ff',
          500: '#8a70ff', // Purple from logo
          600: '#7551ff',
          700: '#5f36e6',
          800: '#4f2ecc',
          900: '#402fa6',
        },
        'teal': {
          100: '#e6fffa',
          200: '#c3f9f4',
          300: '#a5f3ef',
          400: '#85e9e7',
          500: '#5fdcdd', // Teal from logo
          600: '#47b9c2',
          700: '#3797a7',
          800: '#2a768d',
          900: '#245f74',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
