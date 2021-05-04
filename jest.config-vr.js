const ts_preset = require('ts-jest/jest-preset');
const puppeteer_preset = require('jest-puppeteer/jest-preset');

const config = {
  ...ts_preset,
  ...puppeteer_preset,
  testMatch: ['**/*.spec-vr.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest-vr.ts']
};

module.exports = config;
