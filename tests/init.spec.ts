import { expect } from '@playwright/test';
import { test } from './fixtures/test';

test.describe('init', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });

  test('test', async ({ page, holidaysPage }) => {
    // const jpgRequest = page.waitForRequest((request) =>
    //   request.url().endsWith('jpg'),
    // );

    holidaysPage.mockHolidays([{ title: 'Paris' }, { title: 'Berlin' }], true);

    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    // await jpgRequest;

    await page
      .getByLabel('Paris')
      .getByRole('link', { name: 'Get a Brochure' })
      .click();
    await page.getByLabel('Address').fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Brochure sent')).toBeVisible();
  });
});
