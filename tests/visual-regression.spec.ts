import { expect, test as base } from '@playwright/test';
import { ShellFixtures, shellFixtures } from './fixtures/shell.fixtures';
import {
  CustomersFixtures,
  customersFixtures,
} from './fixtures/customer.fixtures';

const test = base.extend<ShellFixtures & CustomersFixtures>({
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

    test('holiday card for Vienna', async ({ page, sidemenuPage }) => {
      await sidemenuPage.select('Holidays');
      await expect(page.getByLabel('Vienna')).toHaveScreenshot('vienna.png');
    });
  });

  test.describe('Storybook', () => {
    for (const story of [
      'angkor-wat',
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
