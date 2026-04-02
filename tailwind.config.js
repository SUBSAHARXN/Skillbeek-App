/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
    extend: {
      boxShadow: {
        'skillbeek-xs': '0px 1px 3px 0px rgba(18, 9, 0, 0.1)',
        'skillbeek-sm': '12px 12px 24px -8px rgba(18, 9, 0, 0), 0px 4px 12px 0px rgba(18, 9, 0, 0.15)',
        'skillbeek-md': '0px 12px 32px -2px rgba(18, 9, 0, 0.15), 0px 8px 4px 0px rgba(18, 9, 0, 0.05)',
        'skillbeek-lg': '0px 40px 72px -8px rgba(18, 9, 0, 0.15), 0px 6px 4px 0px rgba(18, 9, 0, 0.05)',
        'skillbeek-xl': '0px 48px 88px -4px rgba(18, 9, 0, 0.25), 0px 4px 4px 0px rgba(18, 9, 0, 0.05)',
        'skillbeek-inner': 'inset 1px 0px 2px 0px rgba(18, 9, 0, 0.05), inset 0px 4px 4px 0px rgba(18, 9, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
