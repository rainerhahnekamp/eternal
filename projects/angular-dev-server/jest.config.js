const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/projects/angular-dev-server/tsconfig.spec.json',
    },
  },
};
