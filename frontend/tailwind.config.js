/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    fontFamily: {
      sans: ['Open Sans', 'Helvetica', 'sans-serif'],
    },
  },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

