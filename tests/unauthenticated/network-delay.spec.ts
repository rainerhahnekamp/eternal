import { expect } from '@playwright/test';
import { test } from '../fixtures/test';

test('loading indicator on holidays', async ({ page, sidemenuPage }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Application is ready').waitFor();

  page.route('https://api.eternal-holidays.net/holiday', async (req) => {
    const response = await req.fetch();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await req.fulfill({
      response,
    });
  });

  await expect(page.getByRole('progressbar')).not.toBeVisible();
  await sidemenuPage.select('Holidays');

  await expect(page.getByRole('progressbar')).toBeVisible();
  await expect(page.getByRole('progressbar')).not.toBeVisible();
  await expect(page.getByTestId('holiday-card').first()).toBeVisible();
});
