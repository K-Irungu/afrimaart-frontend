module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5858E0',
          'primary-light': '#7272E8',
          'primary-dark': '#4545C7',
          secondary: '#2A2A6B',
          'secondary-light': '#3D3D8B',
          gold: '#FFAC1E',
          magenta: '#A23B7C',
          purple: '#6A2E8D',
          soft: '#E8E7FC',
          background: '#F0EFFC',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
