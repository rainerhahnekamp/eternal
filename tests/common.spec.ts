import { test } from './fixtures/test';
import { expect } from '@playwright/test';

test.describe('Common use Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });

  test('Latitia is from Italy', async ({
    page,
    sidemenuPage,
    customersPage,
  }) => {
    await sidemenuPage.select('Customers');
    await expect(
      customersPage
        .rowByName('Latitia')
        .and(page.getByRole('row').filter({ hasText: 'IT' })),
    ).toBeVisible();
  });

  test('Jack or someone else from UK', async ({
    page,
    sidemenuPage,
    customersPage,
  }) => {
    await sidemenuPage.select('Customers');
    await expect(
      customersPage.rowByName('Jack').or(page.getByText('UK', { exact: true })),
    ).toBeVisible();
  });

  test('check that quiz ends after 300 seconds', async ({
    page,
    sidemenuPage,
  }) => {
    sidemenuPage.select('Holidays');

    await page.clock.install();
    await page
      .getByTestId('holiday-card')
      .first()
      .getByRole('link', { name: 'Quiz' })
      .click();
    await page.getByText(/Time Left: 2\d\d seconds/).waitFor();

    await page.clock.fastForward('10:00');
    await page.getByText('Time is up!').waitFor();
  });
});
