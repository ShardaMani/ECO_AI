/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void-canvas': '#0a0a0a',
        'graphite': '#161616',
        'frosted-glass': 'rgba(212, 212, 212, 0.1)',
        'dusk-violet': '#6b62f2',
      },
      fontFamily: {
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        'geist': ['var(--font-geist)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
