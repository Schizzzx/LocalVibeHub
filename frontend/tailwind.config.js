/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        background: '#2B2A33',
        panel: '#1C1B22',
        field: '#ffffff',
        accent: '#D9D9D9',
        text: '#ffffff',
        'text-on-light': '#000000'
      },
      
      borderRadius: {
        xl: '90px'
      }
    },
  },
  plugins: [],
}
