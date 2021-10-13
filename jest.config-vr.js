const puppeteer_preset = require('jest-puppeteer/jest-preset');

const config = {
  globals: {
    'ts-jest': {}
  },
  testMatch: ['**/*.spec-vr.ts'],
  ...puppeteer_preset,
  setupFilesAfterEnv: ['./setup-jest-vr.ts']
};
module.exports = config;
