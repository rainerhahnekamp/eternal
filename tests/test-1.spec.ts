import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe('Holidays', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });

  test('test', async ({ page, holidaysPageObject }) => {
    // const newPagePromise = context.browser()?.newPage();

    // if (!newPagePromise) {
    //   return;
    // }

    // const newPage = await newPagePromise;
    // await newPage.goto('www.orf.at');

    // await shellPageObject.selectMenuItem('Holidays');

    await page.getByTestId('btn-holidays').click();
    await holidaysPageObject.requestBrochureFor('Wien');

    await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByRole('status')).toHaveText('Brochure sent');
  });
});
