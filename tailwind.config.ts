/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,css}",
    "./pages/**/*.{js,ts,jsx,tsx,css}",
    "./components/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
  	extend: {
  		fontSize: {
  			xxs: '0.65rem',
  			'2.5xl': '1.68rem'
  		},
  		colors: {
  			'gray-85': '#242424',
  			'gray-95': '#141414',
  			'gray-96': '#131313',
  			yellowish: '#c9ff64',
  			ciao: '#ccff33',
  			greenish: '#8fdc00',
  			nav: '#21253a',
  			settings: '#f2f3f8',
  			textSettings: '#636c9b',
  			textSettings1: '#828bb5'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		width: {
  			'128': '32rem',
  			'1.5/4': '27%',
  			'45/6': '70.6%',
  			'7/8': '87.5%',
  			'9/10': '90%'
  		},
  		screens: {
  			xxxs: '320px',
  			xxs: '400px',
  			xs: '480px',
  			sm: '640px',
  			md: '768px',
  			mdd: '895px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		},
  		opacity: {
  			'85': '.85'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
