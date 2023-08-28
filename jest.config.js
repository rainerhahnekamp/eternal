// all properties are inherited from the Angular's jest builder

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testMatch: ["<rootDir>/src/app/**/*.spec.ts"],
  moduleNameMapper: {
    "@app/(.*)$": "<rootDir>/src/app/$1",
  },
};

module.exports = config;
