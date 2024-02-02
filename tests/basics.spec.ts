import { expect } from '@playwright/test';
import { test } from './fixtures/test';

test.describe('Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByTestId('hydrated')).toHaveText(
      'Application is ready',
    );
  });

  test('header is Unforgettable Holidays', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Unforgettable Holidays');
  });
  test('greeting on home', async ({ page }) => {
    await expect(page.getByTestId('txt-greeting-1')).toContainText(
      'imaginary travel',
    );
  });

  test('10 customers should be shown', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    await expect(page.getByTestId('row-customer')).toHaveCount(10);
  });

  test('3rd customer should be Hugo Brandt, 10th should be Jan Janáček', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Customers', exact: true }).click();
    await expect(
      page
        .getByTestId('row-customer')
        .locator('data-testid=name', { hasText: 'Knut Eggen' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('row-customer').nth(2).getByTestId('name'),
    ).toHaveText('Hugo Brandt');
    await expect(
      page.getByTestId('row-customer').nth(9).getByTestId('name'),
    ).toHaveText('Jan Janáček');
  });

  test('add a new customer', async ({ page, sidemenuPage }) => {
    await page.getByRole('link', { name: 'Customers', exact: true }).click();
    await page.getByRole('link', { name: 'Add Customer' }).click();

    await page.getByLabel('Firstname').fill('Nicholas');
    await page.getByLabel('Name', { exact: true }).fill('Dimou');
    await page.getByLabel('Country').click();
    await page.getByRole('option', { name: 'Greece' }).click();

    await page.getByLabel('Birthdate').fill('1.2.1978');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByTestId('row-customer').filter({ hasText: 'Nicholas Dimou' }),
    ).toBeVisible();
  });

  test('rename Latitia', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Latitia Bellitissa' })
      .getByTestId('btn-edit')
      .click();

    await page.getByTestId('inp-name').fill('Bellitissa-Wagner');

    await page.getByTestId('btn-submit').click();

    await expect(
      page.getByTestId('row-customer').filter({ hasText: 'Bellitissa-Wagner' }),
    ).toBeVisible();
  });

  test('delete Knut geggen', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Knut Eggen' })
      .getByTestId('btn-edit')
      .click();

    page.on('dialog', (dialog) => dialog.accept());

    await page.getByTestId('btn-delete').click();

    // Pre-Condition necessary for not !!!
    await expect(page.getByTestId('row-customer').first()).toBeVisible();
    await expect(page.getByText('Knut')).not.toBeVisible();
  });

  test('select the same country again', async ({ page }) => {
    await page.getByTestId('btn-customers').click();

    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Hugo Brand' })
      .getByTestId('btn-edit')
      .click();
    await page.getByTestId('sel-country').click();
    await page
      .getByTestId('opt-country')
      .filter({ hasText: 'Austria' })
      .click();
    await page.getByTestId('btn-submit').click();

    await expect(
      page
        .getByTestId('row-customer')
        .filter({ hasText: 'Hugo Brandt' })
        .locator('mat-cell.mat-column-country'),
    ).toHaveText('AT');
  });
});
