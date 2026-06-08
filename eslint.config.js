// @ts-check
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const sheriff = require("@softarc/eslint-plugin-sheriff");
const unusedImports = require("eslint-plugin-unused-imports");
/** @type {import("eslint-plugin-playwright").default} */
const playwright = require("eslint-plugin-playwright");
const storybook = require("eslint-plugin-storybook");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/component-class-suffix": "off",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    files: ["src/app/**/*.ts"],
    extends: [sheriff.configs.all],
  },
  {
    files: ["tests/**"],
    extends: [playwright.configs["flat/recommended"]],
  },
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  storybook.configs["flat/recommended"],
);
