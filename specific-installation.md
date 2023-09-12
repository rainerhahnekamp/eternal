# Specific Installation Instructions

Next to **installation.md**, this workshop requires additional dependencies:

## Playwright

```bash
npm init playwright
```

Remove **test-examples** and the existing tests in **tests**.

Change the settings so that Playwright automatically starts Angular and set the `basePath` property to `http://localhost:4200`.

Add following scripts to the **package.json**:

```json5
{
  e2e: "playwright test",
  "e2e:dev": "playwright test --ui",
}
```

Add the following file and verify it works via **e2e::debug**

Make sure **e2e:dev** starts the Playwright UI and the website.

**tests/check.spec.ts**

```typescript
import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { name: "Welcome to Eternal" })).toBeVisible();
});
```

## Cypress

```bash
npx ng add @cypress/schematic
```

Remove the `e2e` property from **cypress.config.json**. In the Playwright version, Cypress only provides component testing.

In **cypress/tsconfig.json**, make sure it only matches against `*.cy.ts` files.

## Storybook

Install Storybook via

```bash
npx sb init
```

Remove the folder **src/stories**.

Make sure to add the property `staticDirs` to **.storybook/main.ts**.

## Setup Jest

Install Jest via

```bash
npm i -D jest @types/jest @angular-builders/jest
```

Uninstall Karma via

```bash
npm remove @types/jasmine jasmine-core karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
```

In **tsconfig.spec.json**, change the value "jasmine" to "jest" of the tye `types` property.

In **angular.json**, remove all properties from `projects.eternal.architect.test.builder`.

Create **jest.config.js** with following contents:

```js
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
```

## Testing Utils

```bash
npm i -D @testing-library/angular @testing-library/dom @testing-library/user-event ng-mocks rxjs-marbles
```