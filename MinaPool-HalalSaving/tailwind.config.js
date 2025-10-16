/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blueribbon: '#0052FF',
        woodsmoke: '#0A0B0D',
        ink: '#111318',
        slate: '#EAECEF',
        mist: '#F6F7F9',
        line: '#E5E7EB',
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.06)',
        btn: '0 6px 16px rgba(0,82,255,0.35)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};