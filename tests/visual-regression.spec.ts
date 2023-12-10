import { expect, test as basic } from '@playwright/test';
import {
  CustomersFixtures,
  customersFixtures,
} from './fixtures/customer.fixtures';
import { ShellFixtures, shellFixtures } from './fixtures/shell.fixtures';

const test = basic.extend<ShellFixtures & CustomersFixtures>({
  ...shellFixtures,
  ...customersFixtures,
});

test.describe('Visual Regression', () => {
  test.describe('Application', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
    });

    test('home screenshot', async ({ page }) => {
      await page.getByRole('heading', { name: 'Welcome to Eternal' }).waitFor();
      await expect(page).toHaveScreenshot('home.png');
    });

    test('customers', async ({ page, sidemenuPage, customersPage }) => {
      await page.setViewportSize({ width: 1300, height: 430 });
      await sidemenuPage.select('Customers');
      await customersPage.rowsLocator.first().waitFor();
      await expect(page).toHaveScreenshot('customers.png', {
        fullPage: true,
        omitBackground: true,
        mask: [page.locator('footer')],
        maskColor: 'white',
      });
    });
  });

  test.describe('Storybook', () => {
    for (const story of [
      'default',
      'minimal',
      'overflown',
      'sold-out',
      'empty',
      'tiny-image',
      'on-sale',
      'sale-and-sold',
    ]) {
      test(`story: ${story}`, async ({ page }) => {
        await page.goto(
          `http://localhost:6006/iframe.html?id=eternal-holiday-card--${story}&viewMode=story`,
        );
        await expect(page).toHaveScreenshot(`holiday-card-${story}.png`);
      });
    }
  });
});
