/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'ibc-red': '#C1121F',
        'ibc-blue': '#003049',
        'ibc-light': '#F8F9FA'
      },
      fontFamily: {
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
