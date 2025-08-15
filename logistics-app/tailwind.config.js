/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#2B2D42',
        'cool-gray': '#8D99AE',
        'light-gray': '#EDF2F4',
        'primary-red': '#EF233C',
        'dark-red': '#D90429',
      },
      backgroundColor: {
        'primary': '#EDF2F4',
        'secondary': '#8D99AE',
        'accent': '#EF233C',
        'dark': '#2B2D42',
      },
      textColor: {
        'primary': '#2B2D42',
        'secondary': '#8D99AE',
        'accent': '#EF233C',
        'light': '#EDF2F4',
      },
      borderColor: {
        'primary': '#2B2D42',
        'secondary': '#8D99AE',
        'accent': '#EF233C',
      },
    },
  },
  plugins: [],
}
