/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: '#121212',
        secondary: '#F8F9FA',
        accentPrimary: '#61A0AF',
        accentSecondary: '#9600CC',
        textPrimary: '#FFFFFF',
        textSecondary: '#121212',
        'blue': '#0ea5e9',
        'indigo': '#6366f1',
        'purple': '#8b5cf6',
        'pink': '#ec4899',
      },
      backgroundImage: {
        'custom-gradient': "from-blue-900 via-blue-600 to-blue-400",
        'tw-gradient': "linear-gradient(to right, rgb(14, 165, 233), rgb(99, 102, 241), rgb(139, 92, 246), rgb(236, 72, 153))"
      },
      animation: {
        'gradient-shift': 'gradient-shift 10s ease infinite alternate',
        'blob-shift': 'blob-shift 25s ease infinite',
        'blob-shift-alt': 'blob-shift-alt 30s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'blob-shift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(5%, 5%) scale(1.05)' },
          '50%': { transform: 'translate(0%, 10%) scale(0.95)' },
          '75%': { transform: 'translate(-5%, 5%) scale(1.05)' },
        },
        'blob-shift-alt': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-5%, -5%) scale(1.05)' },
          '50%': { transform: 'translate(0%, -10%) scale(0.95)' },
          '75%': { transform: 'translate(5%, -5%) scale(1.05)' },
        },
      }
    },
  },
  plugins: [],
}