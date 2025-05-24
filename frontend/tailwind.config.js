/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#008060',
        background: '#f8f9fa',
        dark: '#111',
      },
    },
  },
  plugins: [],
}
