import { test } from './fixtures/test';
import { expect } from './matchers/expect';

test.describe('session', () => {
  test('not signed in', async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
    await page.getByTestId('btn-customers').waitFor();

    // reason for timeout override:
    await expect
      .configure({ timeout: 1000 })(page.getByText('Welcome John List'))
      .not.toBeVisible();
  });

  test.describe('authenticated', () => {
    // test.use({ storageState: 'john-list.json' });
    test('signed in', async ({ page }) => {
      await page.goto('');
      await expect(page.getByText('Welcome John List')).toBeVisible();
    });
  });
});
