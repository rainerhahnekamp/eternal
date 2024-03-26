import { test, expect } from '@playwright/test';

test.describe('failing tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });

  test('should rename Renate Hoffmann to Renate Hoffmann', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Renate Hoffmann' })
      .getByTestId('btn-edit')
      .click();

    await page.getByTestId('inp-name').clear();
    await page.getByTestId('inp-name').fill('Hofman');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.locator('data-testid=row-customer', { hasText: 'Renate Hofman' }),
    ).toBeVisible();
  });

  test('should use a synchronous assertion', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    const customersCount = await page.getByTestId('row-customer').count();
    expect(customersCount).toHaveLength(10);
  });

  test('should remove Knut Eggen', async ({ page }) => {
    await page.getByTestId('btn-customers').click();
    await page
      .getByTestId('row-customer')
      .filter({ hasText: 'Knut Eggen' })
      .getByTestId('btn-edit')
      .click();
    page.on('dialog', (page) => page.accept());
    await page.getByTestId('btn-delete').click();
    await expect(
      page.getByTestId('row-customer').filter({ hasText: 'Knut Eggen' }),
    ).not.toBeVisible();
  });

  test('loading indicator', async ({ page }) => {
    await page.getByTestId('btn-holidays').click();
    await expect(page.getByTestId('loading-indicator')).not.toBeVisible();
  });

  test.fixme('verify image loading', async ({ page }) => {});
});
