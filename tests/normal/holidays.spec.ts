import { expect } from '@playwright/test';
import { test } from '../fixtures/test';

test.describe('Init', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test.skip('request brochure for Vienna', async ({ page }) => {
    await page.getByTestId('btn-holidays').click();
    await page
      .getByTestId('holiday-card')
      .filter({ hasText: 'Vienna' })
      .getByTestId('btn-brochure')
      .click();
    await page.getByTestId('');
  });

  test('request brochure', async ({
    page,
    sidemenuPageObject,
    holidaysPageObject,
  }) => {
    await test.step('navigation', async () => {
      await sidemenuPageObject.clickMenuItem('Holidays');
      await page.getByTestId('btn-holidays').click();

      await page.getByLabel('Vienna').locator('parent=div').waitFor();
      await holidaysPageObject.requestBrochure('Vienna');
    });

    await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect.soft(page.getByRole('status')).toHaveText('Brochure sent');
  });
});
