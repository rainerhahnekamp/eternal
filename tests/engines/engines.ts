import { test } from '@playwright/test';
import { createParentEngine } from './parent-engine';

export const enginesTest = test.extend<
  Record<never, never>,
  { selectorRegistration: void }
>({
  selectorRegistration: [
    async ({ playwright }, use) => {
      await playwright.selectors.register('parent', createParentEngine);
      await use();
    },
    { scope: 'worker', auto: true },
  ],
});
