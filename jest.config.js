// all properties are inherited from the Angular's jest builder

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testMatch: ["<rootDir>/src/app/**/*.spec.ts"],
};

module.exports = config;
