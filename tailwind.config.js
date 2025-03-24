/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-gabarito)'],
      },
      colors: {
        accent: '#ffe5f1',
        text: '#654b56',
        cream: '#fcf5f2',
      },
    },
  },
  plugins: [],
}