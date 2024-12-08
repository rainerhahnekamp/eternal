import { expect, test as base } from '@playwright/test';
import {
  CustomersFixtures,
  customersFixtures,
} from './fixtures/customer.fixtures';
import { shellFixtures, ShellFixtures } from './fixtures/shell.fixtures';

const test = base.extend<CustomersFixtures & ShellFixtures>({
  ...customersFixtures,
  ...shellFixtures,
});
test.describe('Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });

  test('header is Unforgettable Holidays', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Unforgettable Holidays');
  });

  test('greeting on home', async ({ page }) => {
    await expect(page.getByTestId('txt-greeting-1')).toContainText(
      'imaginary travel agency',
    );
  });

  test.describe('Customers', () => {
    test.beforeEach(async ({ sidemenuPage }) => {
      await sidemenuPage.select('Customers');
    });

    test('customers list shows 10 rows', async ({ customersPage }) => {
      await expect(customersPage.rowsLocator).toHaveCount(10);
    });

    test('3rd customer is Brandt, Hugo; 10th is Janáček, Jan', async ({
      customersPage,
    }) => {
      await expect(
        customersPage.rowsLocator.getByTestId('name').nth(2),
      ).toHaveText('Hugo Brandt');
      await expect(
        customersPage.rowsLocator.getByTestId('name').nth(9),
      ).toHaveText('Jan Janáček');
    });

    test('add Nicholas Dimou as new customer', async ({
      customersPage,
      customerPage,
    }) => {
      await customersPage.add();
      await customerPage.fillIn({
        firstname: 'Nicholas',
        lastname: 'Dimou',
        country: 'Greece',
        birthday: new Date(1978, 3, 1),
      });
      await customerPage.submit();

      await expect(customersPage.rowByName('Nicholas Dimou')).toBeVisible();
    });

    test('rename Latitia to Laetitia', async ({
      customersPage,
      customerPage,
    }) => {
      await customersPage.edit('Latitia');
      await customerPage.fillIn({
        firstname: 'Laetitia',
        lastname: 'Bellitissa-Wagner',
        country: 'Austria',
      });
      await customerPage.submit();

      await expect(customersPage.rowByName('Bellitissa-Wagner')).toBeVisible();
    });

    test('delete Knut Eggen', async ({ page, customersPage, customerPage }) => {
      test.fail();
      await customersPage.edit('Knut Eggen');

      page.on('dialog', (dialog) => dialog.accept());
      await customerPage.remove();

      await expect(customersPage.rowsLocator).toHaveCount(10);
      await expect
        .configure({ timeout: 2000 })(customersPage.rowByName('Knut Eggen'))
        .toBeVisible();
    });

    test('select the same country again', async ({
      customerPage,
      customersPage,
    }) => {
      await customersPage.edit('Hugo Brandt');
      await customerPage.fillIn({ country: 'Austria' });
      await customerPage.submit();
    });
  });
});
