import { Locator, expect } from '@playwright/test';

export const toHaveMatIcon = expect.extend({
  async toHaveMatIcon(locator: Locator, expected: void) {
    const name = 'toHaveMatIcon';
    return expect(locator.locator('mat-icon'))
      .toBeVisible()
      .then(() => ({
        message: () => 'mat icon is there',
        pass: true,
        name,
        expected,
        actual: {},
      }))
      .catch(() => ({
        message: () => 'no mat icon is there',
        pass: false,
        name,
        expected,
        actual: {},
      }));
  },
});
