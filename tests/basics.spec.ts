import { expect, test } from '@playwright/test';

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

  test('customers list shows 10 rows', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    const tableLocator = page
      .getByRole('table', { name: 'Customers' })
      .getByRole('rowgroup')
      .last();
    await expect(tableLocator).toHaveCount(10);
  });

  test('3rd customer is Hugo Brandt; 10th is Jan Janáček', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    const tableLocator = page
      .getByRole('table', { name: 'Customers' })
      .getByRole('rowgroup')
      .last()
      .getByRole('row');

    await expect(tableLocator.nth(2)).toContainText('Hugo Brandt');
    await expect(tableLocator.nth(9)).toContainText('Jan Janáček');
  });

  test('add Nicholas Dimou as new customer', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    await page.getByRole('link', { name: 'Add Customer' }).click();

    await page.getByRole('textbox', { name: 'Firstname' }).fill('Nicholas');
    await page
      .getByRole('textbox', { name: 'Name', exact: true })
      .fill('Dimou');
    await page.getByRole('combobox', { name: 'Country' }).click();

    await page.getByRole('option', { name: 'Greece' }).click();

    await page.getByRole('textbox', { name: 'Birthdate' }).fill('1.2.1978');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page
        .getByRole('table', { name: 'Customers' })
        .getByRole('row')
        .getByText('Nicholas Dimou'),
    ).toBeVisible();
  });

  test('rename Latitia to Laetitia', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    await page
      .getByRole('table', { name: 'Customers' })
      .getByRole('row')
      .filter({ hasText: 'Latitia' })
      .getByRole('link', { name: 'Edit' })
      .click();

    await page.getByRole('textbox', { name: 'Firstname' }).fill('Laetitia');
    await page
      .getByRole('textbox', { name: 'Name', exact: true })
      .fill('Bellitissa-Wagner');
    await page.getByRole('combobox', { name: 'Country' }).click();

    await page.getByRole('option', { name: 'Austria' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page
        .getByRole('table', { name: 'Customers' })
        .getByRole('row')
        .getByText('Bellitissa-Wagner'),
    ).toBeVisible();
  });

  test('delete Knut Eggen', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    await page
      .getByRole('table', { name: 'Customers' })
      .getByRole('row')
      .filter({ hasText: 'Knut eggen' })
      .getByRole('link', { name: 'Edit' })
      .click();
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).click();

    const locator = page
      .getByRole('table', { name: 'Customers' })
      .getByRole('rowgroup')
      .last()
      .getByRole('row');
    await expect(locator).toHaveCount(10);

    await expect(page.getByText('Bellitissa-Wagner')).not.toBeVisible();
  });

  test('should request brochure for Firenze', async ({ page }) => {
    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByLabel(/Firenze/i)
      .getByRole('link', { name: 'Brochure' })
      .click();
    await page.getByLabel('Address').fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByRole('status')).toHaveText('Brochure sent');
  });
});
