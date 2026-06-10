/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'skillbeek-xs': '0px 1px 3px rgba(18, 9, 0, 0.1)',
        'skillbeek-sm': '0px 4px 12px rgba(18, 9, 0, 0.15)',
        SM: "var(--SM)",
        XS: "var(--XS)",
      },
      fontFamily: {
        nunito: ['var(--Typeface-Nunito)'],
      },
      fontSize: {
        'Subtitle': ['var(--Font-size-Subtitle)', { lineHeight: 'var(--Line-height-Subtitle)', letterSpacing: 'var(--Responsive-grid-Tracking-Subtitle)', fontWeight: 'var(--Font-weight-600-semi-bold)' }],
        'D3': ['var(--Font-size-D3)', { lineHeight: 'var(--Line-height-D3)', letterSpacing: 'var(--Responsive-grid-Tracking-D3)', fontWeight: 'var(--Font-weight-700-bold)' }],
        'H3': ['var(--Font-size-H3)', { lineHeight: 'var(--Line-height-H3)', letterSpacing: 'var(--Responsive-grid-Tracking-H3)', fontWeight: 'var(--Font-weight-700-bold)' }],
        'Paragraph': ['var(--Font-size-Paragraph)', { lineHeight: 'var(--Line-height-Paragraph)', letterSpacing: 'var(--Responsive-grid-Tracking-Paragraph)' }],
      },
      gap: {
        'token-6': 'var(--Gap-Width-Height-6)',
        'token-8': 'var(--Gap-Width-Height-8)',
        'token-12': 'var(--Gap-Width-Height-12)',
        'token-16': 'var(--Gap-Width-Height-16)',
        'token-24': 'var(--Gap-Width-Height-24)',
        'token-56': 'var(--Gap-Width-Height-56)',
        'token-92': 'var(--Gap-Width-Height-92)',
      }
    },
  },
  plugins: [],
};
