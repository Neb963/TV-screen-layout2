/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        broadcast: {
          red: '#cc0000',
          blue: '#0033a0',
          yellow: '#ffcc00',
          dark: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}
