import { expect, test } from '@playwright/test';

test.describe('init', () => {
  test.only('request brochure', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await expect(
      page.locator('app-holiday-card').filter({ hasText: 'Vienna' }),
    ).toBeVisible();
    await page
      .locator('app-holiday-card')
      .filter({ hasText: 'Vienna' })
      .getByTestId('btn-brochure')
      .click();

    await page.getByTestId('address').fill('Domgasse 5');
    await page.getByTestId('btn-search').click();
    await expect(page.getByTestId('lookup-result')).toHaveText('Brochure sent');
  });

  test('has title', async ({ page }) => {
    await page.goto('');
    await page.locator('div');
  });
});
