/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {colors:{
      primary: '#0A100D',
      secondary: '#7EA8BE',
      accent: '#61A0AF',
      neutral: '#FFFFFF'
      }}
  },
  plugins: [],
}

