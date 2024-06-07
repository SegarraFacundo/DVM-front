/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      roboto: ['Roboto Flex', 'sans-serif']
    },
    extend: {
      backgroundColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D',
        light: '#EBE9E9'
      },
      textColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D',
        light: '#EBE9E9'
      },
      borderColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D',
        light: '#EBE9E9'
      },
      accentColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D',
        light: '#EBE9E9'
      },
      animation: {
        orbit: 'orbit 3s linear infinite'
      },
      keyframes: {
        orbit: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(360deg)' }
        }
      }
    }
  },
  plugins: []
}
