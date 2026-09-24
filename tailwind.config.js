/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rough: '#14482f',
        deep: '#0c2e1e',
        cut: '#1a5a3a',
        fairway: '#23714a',
        stripe: '#2a7d53',
        putt: '#6cc15a',
        sand: '#e7d39a',
        water: '#2f6fd6',
        flag: '#ef3b2c',
        chalk: '#f3f6ef',
        mist: '#b7cdbd',
        moss: '#9dbfa8',
        card: '#f4f6f1',
        ink: '#12402a',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Arial Narrow', 'sans-serif'],
        sans: ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Azeret Mono"', 'ui-monospace', 'monospace'],
        pencil: ['"Nanum Pen Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
