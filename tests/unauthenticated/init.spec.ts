import { expect } from '@playwright/test';
import { test } from '../fixtures/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Application is ready').waitFor();
  await page.getByTestId('btn-customers').click();
  await expect(
    page
      .getByText('Helene Ford')
      .locator('sibling=td')
      .filter({ has: page.locator('mat-icon') }),
  ).toBeVisible();
});
