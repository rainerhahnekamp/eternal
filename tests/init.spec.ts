import { expect } from './matchers/expect';
import { test } from './fixtures/test';
import { CustomerPage } from './page-objects/customer-page';

test.describe('Init', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });
  test('test', async ({ page, sidemenuPage }) => {
    await sidemenuPage.select('Customers');
    await expect
      .configure({ soft: true })(page.getByText('Latitia'))
      .toBeVisible();
  });

  test('holidays request', async ({ page, sidemenuPage }) => {
    const request = page.waitForResponse((response) =>
      response.url().startsWith('https://api.eternal'),
    );
    await sidemenuPage.select('Holidays');
    await request;
  });

  test('browser check', async ({ page }) => {
    await page.goto('https://www.whatismybrowser.com/');
  });
});
