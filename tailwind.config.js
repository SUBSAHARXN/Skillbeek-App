/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'skillbeek-xs': '0px 1px 3px rgba(18, 9, 0, 0.1)',
        'skillbeek-sm': '0px 4px 12px rgba(18, 9, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
