/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        glow: 'glow 4s ease-in-out infinite alternate',
        'col-drift-a': 'colDriftA 22s ease-in-out infinite',
        'col-drift-b': 'colDriftB 28s ease-in-out infinite',
        'col-drift-c': 'colDriftC 19s ease-in-out infinite',
        'prd-orbit': 'prdOrbit 14s linear infinite',
        'prd-pulse': 'prdPulse 2.4s ease-in-out infinite',
        'nw-ticker': 'nwTicker 38s linear infinite',
        'nw-blink': 'nwBlink 1.1s step-end infinite',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4', transform: 'scale(0.95)' },
          '100%': { opacity: '0.85', transform: 'scale(1.05)' },
        },
        colDriftA: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(32px, -28px) scale(1.06)' },
        },
        colDriftB: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.02)' },
          '50%': { transform: 'translate(-40px, 24px) scale(0.96)' },
        },
        colDriftC: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(18px, 36px) rotate(8deg)' },
        },
        prdOrbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        prdPulse: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(1.04)' },
        },
        nwTicker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        nwBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

