/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: '#121212',
        secondary: '#F8F9FA',
        accent: '#61A0AF',
        textPrimary: '#FFFFFF',
        textSecondary: '#121212',
      },
    backgroundImage:{
      'custom-gradient': "linear-gradient(.25turn, #cf414b, #852170)"
    }
  }
  },
  plugins: [],
}

