/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          dark: '#0b1120',
          sidebar: '#111c2e',
          blue: '#0084c7',
          blueHover: '#0284c7',
          lightBg: '#f8fafc',
          cardBg: '#ffffff',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
