import type { Config } from 'tailwindcss';
const {nextui} = require("@nextui-org/react");


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
      backgroundColor: {
        'hatcheryblue': 'rgb(79, 69, 228)', // Add your custom color as background color
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-20px)' },
      },
    },
    animation: {
      'levitate': 'float 3s ease-in-out infinite',
      'levitate-6s': 'float 6s ease-in-out infinite',
    },
  },
  darkMode: "class",
  plugins: [
    nextui()
  ],
};
export default config;
