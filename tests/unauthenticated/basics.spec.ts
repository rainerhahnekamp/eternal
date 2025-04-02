import { expect } from '@playwright/test';
import { test } from '../fixtures/test';

test.describe('Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });

  test('header is Unforgettable Holidays', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Unforgettable Holidays',
    );
  });

  test('greeting on home', async ({ page }) => {
    await expect(page.getByText('imaginary travel agency')).toBeVisible();
  });

  test.describe('Customers', () => {
    test.beforeEach(async ({ sidemenuPage }) => {
      await sidemenuPage.select('Customers');
    });

    test('customers list shows 10 rows', async ({ customersPage }) => {
      await expect(customersPage.rowsLocator).toHaveCount(10);
    });

    test('3rd customer is Hugo Brand; 10th is Jan Janáček', async ({
      customersPage,
    }) => {
      await expect(customersPage.rowsLocator.nth(2)).toContainText(
        'Hugo Brandt',
      );
      await expect(customersPage.rowsLocator.nth(9)).toContainText(
        'Jan Janáček',
      );
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
      await customersPage.edit('Knut Eggen');

      page.on('dialog', (dialog) => dialog.accept());
      await customerPage.remove();

      await expect(customersPage.rowsLocator).toHaveCount(10);
      await expect(customersPage.rowByName('Knut Eggen')).toBeHidden();
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
