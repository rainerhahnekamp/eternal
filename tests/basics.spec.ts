import { expect } from '@playwright/test';
import { test } from './fixtures/test';

test.describe('Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });

  test('header is Unforgettable Holidays', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Unforgettable Holidays');
  });

  test('greeting on home', async ({ page }) => {
    await expect(page.getByTestId('txt-greeting-1')).toContainText(
      'imaginary travel agency',
    );
  });

  test('customers list shows 10 rows', async ({ page, shellPageObject }) => {
    await shellPageObject.openCustomers();
    const locator = page.getByTestId('row-customer');
    await expect(locator).toHaveCount(10);
  });

  test('3rd customer is Hugo Brandt; 10th is Jan Janáček', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    const nameLocator = page.getByTestId('row-customer').getByTestId('name');

    await expect(nameLocator.nth(2)).toHaveText('Hugo Brandt');
    await expect(nameLocator.nth(9)).toHaveText('Jan Janáček');
  });

  test('add Nicholas Dimou as new customer', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    await page.getByTestId('btn-customers-add').click();
    await page.getByTestId('inp-firstname').fill('Nicholas');
    await page.getByTestId('inp-name').fill('Dimou');
    await page.getByTestId('sel-country').click();
    await page.getByText('Greece').click();
    await page.getByTestId('inp-birthdate').fill('1.2.1978');
    await page.getByTestId('btn-submit').click();

    await expect(
      page.getByTestId('row-customer').filter({ hasText: 'Nicholas Dimou' }),
    ).toBeVisible();
  });

  test('rename Latitia to Laetitia', async ({ page }) => {
    await page.getByTestId('btn-customers').click();

    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Latitia' })
      .getByTestId('btn-edit')
      .click();
    await page.getByTestId('inp-firstname').fill('Laetitia');
    await page.getByTestId('inp-name').fill('Bellitissa-Wagner');
    await page.getByTestId('sel-country').click();
    await page.getByText('Austria').click();
    await page.getByTestId('btn-submit').click();

    await expect(
      page.getByTestId('row-customer').filter({
        hasText: 'Bellitissa-Wagner',
      }),
    ).toBeVisible();
  });

  test('delete Knut Eggen', async ({ page }) => {
    await page.getByTestId('btn-customers').click();

    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Knut Eggen' })
      .getByTestId('btn-edit')
      .click();
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByTestId('btn-delete').click();

    const locator = page.getByTestId('row-customer');

    await expect(locator).toHaveCount(10); // Vorbedingung
    await expect(
      page.getByTestId('row-customer').filter({ hasText: 'Knut Eggen' }),
    ).not.toBeVisible();
  });

  test('select the same country again', async ({ page }) => {
    await page.getByTestId('btn-customers').click();

    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Hugo Brand' })
      .getByTestId('btn-edit')
      .click();
    await page.getByTestId('sel-country').click();
    await page.getByTestId('opt-country').getByText('Austria').click();

    await page.getByTestId('btn-submit').click();
  });

  test.describe('user-facing selectors', () => {
    test('should request brochure for Firenze', async ({ page }) => {
      await page.getByRole('link', { name: 'Holidays', exact: true }).click();
      await page
        .getByLabel(/Firenze/i)
        .getByRole('link', { name: 'Get a Brochure' })
        .click();
      await page.getByLabel('Address').fill('Domgasse 5');
      await page.getByRole('button', { name: 'Send' }).click();
      await expect(page.getByRole('status')).toHaveText('Brochure sent');
    });

    test('should rename Latitia to Laetitia', async ({ page }) => {
      await page.getByRole('link', { name: 'Customers', exact: true }).click();
      await page
        .getByLabel(/Latitia/i)
        .getByRole('link', { name: 'Edit Customer' })
        .click();
      await expect(page.getByLabel('Firstname')).toHaveValue('Latitia');
      await page.getByLabel('Firstname').fill('Laetitia');
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('link', { name: 'Edit Customer' }),
      ).toHaveCount(10);
      await expect(page.getByLabel(/Latitia/)).toHaveCount(0);
    });
  });
});
