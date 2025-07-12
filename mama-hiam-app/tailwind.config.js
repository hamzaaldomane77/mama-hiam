/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#E26B30',
        'light-orange': '#F4A955',
        'sky-blue': '#4A90E2',
        'dark-blue': '#2D5D9F',
        'light-yellow': '#F8D87A',
        'cream-beige': '#F5E0C6',
        'brick-red': '#C44230',
      },
      fontFamily: {
        'almarai': ['Almarai', 'sans-serif'],
        'sans': ['Almarai', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

