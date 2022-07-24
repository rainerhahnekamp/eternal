import { getJestProjects } from '@nrwl/jest';

export default {
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
