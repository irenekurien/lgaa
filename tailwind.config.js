/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/api/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/config/**/*.{js,ts,jsx,tsx}",
    "./src/const/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/types/**/*.{js,ts,jsx,tsx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
    "./src/views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            brand: {
                50: '#FAFAFF',
                100: '#F3F3FF',
                200: '#E5E5FF',
                300: '#DBDBFF',
                400: '#C3C3FF',
                500: '#A4A4FF',
                600: '#7676FA',
                700: '#6565E9',
                800: '#4A4AD3',
                900: '#2B2B9B',
            },
            green: {
                450: '#31C48D',
                550: '#0E9F6E',
            },
            'chat-bg': '#EEEEEE',
            'chat-text': '#1F2D3D'
        },
        keyframes: {
            'fade-in-up': {
                '0%': {
                    opacity: '0',
                    transform: 'translateY(25%)'
                },
                '50%':{
                },
                '100%': {
                    opacity: '1',
                    transform: 'translateY(0)'
                },
            },
        },
        animation: {
            'fade-in-up': 'fade-in-up 0.5s ease-out',
         }
    },
},

variants: {
    extend: {},
},
plugins: [],
};
