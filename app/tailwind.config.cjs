/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    minWidth: {
      '1/2': '50%',
    },

    extend: {
      dropShadow: {
        'footer': '0px 1px 32px rgba(154, 196, 248, 0.25)'
      }
    },
    colors: {
      'primary': '#13293D',
      'secondary': '#9AC4F8',
      'danger': '#F25F5C',
      'white': '#fff',
      'card-bg': '#001A23'
    },
    fontFamily: {
      'sans': ['Hammersmith-One', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      'mono': ['Anonymous-mono', 'ui-monospace', 'SFMono-Regular', "Courier New", 'monospace']
    }
  },
  plugins: [],
}
