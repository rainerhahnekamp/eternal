import { test } from './fixtures/test';
import { expect } from './matchers/expect';

test('select customer', async ({ page }) => {
  await page.goto('');
  await page.getByText('Application is ready').waitFor();
  await page.getByRole('link', { name: 'Customers' }).click();
  await expect(
    page
      .getByText('Hugo Brandt')
      .locator('sibling=mat-cell')
      .getByTestId('btn-edit'),
  ).toHaveMatIcon();
});
