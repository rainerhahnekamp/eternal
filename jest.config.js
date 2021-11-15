const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: getJestProjects(),
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  collectCoverageFrom: ['**/src/app/**']
};
