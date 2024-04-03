/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/renderer/**/*.{js,ts,jsx,tsx}'
  ],
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
        dark: '#1C2E3D'
      },
      textColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D'
      },
      borderColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D'
      },
      accentColor: {
        default: '#D9D9D9',
        success: '#32CF9C',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#1C2E3D'
      }
    }
  },
  plugins: []
}
