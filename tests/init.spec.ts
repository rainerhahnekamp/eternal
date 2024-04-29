import { test } from './fixtures/test';
import { expect } from '@playwright/test';

test.describe('Init', () => {
  test.use({ storageState: 'john-list.json' });
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('should be authenticated', async ({ page }) => {
    await expect(page.getByText('Welcome John List')).toBeVisible();
  });

  test('test', async ({ page, sidemenuPage, holidaysPage }) => {
    await test.step('go to form', async () => {
      await expect
        .configure({ soft: true })(page.getByText('Unforgettable Holidays'))
        .toBeVisible();
      await sidemenuPage.open('Holidays');
      await holidaysPage.requestBrochure('Granada');
    });
    await test.step('fill out form', async () => {
      await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5');
      await page.getByRole('button', { name: 'Send' }).click();
    });
  });
});
