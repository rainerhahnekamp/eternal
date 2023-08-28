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

```

## Testing Utils

```bash
npm i -D @testing-library/angular ng-mocks rxjs-marbles
```
