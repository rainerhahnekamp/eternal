module.exports = {
  content: [
    './apps/eternal/src/**/*.{html,ts}',
    './libs/**/src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
