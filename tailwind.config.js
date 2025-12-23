/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
   theme: {
    extend: {
      padding: {
        '3.75': '0.9375rem', // 15px / 16
        '2.5': '0.625rem',   // 10px / 16
      },
      spacing: {
        '7.5': '1.875rem',   // 30px / 16
        '2.5': '0.625rem',   // 10px / 16
      }
    }
  },
  plugins: [],
}