import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe('CRUD for Customers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('add, edit, and delete customer', async ({
    page,
    sidemenuPage,
    customersPage,
    customerPage,
  }) => {
    await test.step('create', async () => {
      await sidemenuPage.select('Customers');
      await customersPage.add();
      await customerPage.fillIn({
        firstname: 'Rudolf',
        lastname: 'Huber',
        country: 'Germany',
        birthday: new Date(1990, 5, 1),
      });
      await customerPage.submit();
      await expect.soft(customersPage.rowByName('Rudolf Huber')).toBeVisible();
    });

    await test.step('edit', async () => {
      await customersPage.edit('Rudolf Huber');
      await customerPage.fillIn({ firstname: 'Rudi' });
      await customerPage.submit();
      await expect.soft(customersPage.rowByName('Rudi Huber')).toBeVisible();
    });

    await test.step('remove', async () => {
      await customersPage.edit('Rudi Huber');
      page.on('dialog', (dialog) => dialog.accept());
      await customerPage.remove();
      await expect.soft(customersPage.rowsLocator).toHaveCount(10);
      await expect
        .soft(customersPage.rowByName('Rudi Huber'))
        .not.toBeVisible();
    });
  });
});
