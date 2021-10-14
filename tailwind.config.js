module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./apps/eternal/src/**/*.{html,ts}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
