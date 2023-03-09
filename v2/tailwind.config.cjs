/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["SF-Pro-Regular",'ui-serif', 'sans-serif'],
        semibold: ["SF-Pro-Semibold",'ui-serif', 'sans-serif'],
        thin: ["SF-Pro-Thin",'ui-serif', 'sans-serif'],
      },
    },
    colors: {
      'light': '#FFFFFF',
      'dark': '#1E1E1E',
      'pink': '#E572C5',
      'purple': '#715DF2',
      'off-blue': '#9AC4F8',
      'off-grey': '#9C9C9C',
      'card-primary-blue': '#13293D',
      'card-secondary-blue': '#001A23',
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}
