import { expect, Locator } from '@playwright/test';

export const toLookLikeAButtonExpect = expect.extend({
  async toLookLikeAButton(locator: Locator, expected: void) {
    const name = 'toLookLikeAButton';
    return expect(locator)
      .toHaveAttribute('mat-raised-button')
      .then(
        () => {
          return {
            message: () => 'Looks like a button',
            pass: true,
            name,
            expected,
            actual: {},
          };
        },
        () => {
          return {
            message: () => 'Does not look like a button',
            pass: false,
            name,
            expected,
            actual: {},
          };
        },
      );
  },
});
