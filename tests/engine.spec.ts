import { test } from './fixtures/test';
import { expect } from './matchers/expect';

test('should use the parent engine', async ({ page, sidemenuPage }) => {
  await page.goto('');
  await page.getByText('Application is ready').waitFor();

  await sidemenuPage.open('customers');

  await expect(
    page.getByRole('link', { name: 'Add Customer' }),
  ).toLookLikeAButton();

  await page
    .getByText('Helene')
    .locator('parent=mat-row')
    .getByTestId('btn-edit')
    .click();
});
