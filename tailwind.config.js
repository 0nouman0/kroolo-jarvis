/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'osmo-blue': '#3B82F6',
        'osmo-purple': '#8B5CF6',
        'osmo-pink': '#EC4899',
        'osmo-cyan': '#06B6D4',
        'osmo-green': '#22C55E',
        'osmo-yellow': '#FACC15',
        'osmo-gray': '#F3F4F6',
        'osmo-dark': '#18181B',
      },
      boxShadow: {
        'osmo': '0 4px 24px 0 rgba(43, 43, 43, 0.10)',
        'osmo-lg': '0 8px 32px 0 rgba(43, 43, 43, 0.18)',
      },
      borderRadius: {
        'osmo': '1.5rem',
        'osmo-lg': '2.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
