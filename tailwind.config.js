/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marico: {
          blue: '#1c4f9c',
          'blue-dark': '#0e3d7a',
          green: '#6cbd45',
          'green-dark': '#5ba83a',
        },
      },
    },
  },
  plugins: [],
}