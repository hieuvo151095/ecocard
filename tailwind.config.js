/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          blue: {
            DEFAULT: '#0070CE',
            50: '#E6F1FB',
            100: '#CCE2F5',
            200: '#99C6EB',
            300: '#66A9E2',
            400: '#338DD8',
            500: '#0070CE',
            600: '#00549B',
            700: '#003867',
          },
          yellow: {
            DEFAULT: '#FFC700',
            brand: '#FEC020',
            50: '#FFFAE6',
            100: '#FFF4CC',
            200: '#FFE999',
            300: '#FFDD66',
            400: '#FFD233',
            500: '#FFC700',
          },
          green: {
            DEFAULT: '#00AB56',
            50: '#E6F7EF',
            600: '#00AB56',
          },
          red: {
            DEFAULT: '#FF424E',
            50: '#FFF1F2',
            600: '#FF424E',
          },
          orange: {
            DEFAULT: '#FF9F41',
            50: '#FFF5EB',
          },
          neutral: {
            bg: '#F5F6FA',
            border: '#E8EAEC',
            divider: '#D1D5D9',
            text: '#232628',
            subtext: '#687179',
            muted: '#8B97A1',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
