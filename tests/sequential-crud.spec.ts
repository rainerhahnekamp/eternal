import { expect } from '@playwright/test';
import { test } from './fixtures/test';

test.describe('Sequential CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  let firstname = 'Rudolf';
  const lastname = `Huber ${Math.floor(Math.random() * 100000)}`;
  let name = `${firstname} ${lastname}`;

  test.beforeEach(async ({ page, sidemenuPage }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
    await page.getByRole('switch', { name: 'Mock Customers' }).click();
    await sidemenuPage.select('Customers');
  });

  test('add Rudolf Huber', async ({
    customersPage,
    customerPage,
  }, testInfo) => {
    testInfo.attach(name, { body: name });
    await customersPage.add();
    await customerPage.fillIn({
      firstname: firstname,
      lastname,
      country: 'Germany',
      birthday: new Date(1990, 5, 1),
    });
    await customerPage.submit();
    await customersPage.navigateToPage(name);
  });

  test('rename Rudolf to Rudi', async ({ customersPage, customerPage }) => {
    firstname = 'Rudi';
    await customersPage.navigateToPage(name);
    await customersPage.edit(name);
    await customerPage.fillIn({ firstname });
    await customerPage.submit();
    name = `${firstname} ${lastname}`;
    await customersPage.navigateToPage(name);
    await expect.soft(customersPage.rowByName(name)).toBeVisible();
  });

  test('remove Rudi', async ({
    page,
    customersPage,
    customerPage,
  }, testInfo) => {
    await customersPage.navigateToPage(name);
    await customersPage.edit(name);
    page.on('dialog', (dialog) => dialog.accept());
    await customerPage.remove();
    const errorMessage = await customersPage
      .navigateToPage(name)
      .catch((err) => err.message);
    expect(errorMessage).toBe('Customer could not be found');
  });
});
