/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '48rem',
      },
      fontFamily: {
        "nunito": ["Nunito", "sans-serif"],
      },
      height: {
        'custom': '98%', 
      },
      width: {
        'custom': '83%', 
      }
    },
  },
  plugins: [],
}

