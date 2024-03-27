import { test, expect } from '@playwright/test';
import { getByRole } from '@testing-library/angular';
import exp from 'constants';

test.describe('Init', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    // await page.getByText('Application is ready');
  });
  test('test', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers', exact: true }).click();
    const links = await page.getByRole('link').count();
    // await page
    //   .getByLabel('Vienna')
    //   .getByRole('link', { name: 'Brochure' })
    //   .click();
    // await page.getByRole('textbox', { name: 'Address' });
    // await page.getByRole('link').waitFor();
    // await page.locator('[data-testid=address]');
    //   await expect(page.locator('#holiday-card-1')).toContainText('Wien');
  });

  test('browser check', async ({ page }) => {
    await page.goto('https://www.whatismybrowser.com/');
  });
});
