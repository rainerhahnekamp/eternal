import { test, expect } from '@playwright/test';
import { first } from 'rxjs';

test.describe('bonus tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });

  test.describe('failing tests', () => {
    test('should rename Renate Hoffmann to Renate Hoffmann', async ({
      page,
    }) => {
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
  });

  test.describe('false positives', () => {
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
      await page.getByTestId('btn-customers').click();
      await expect(page.getByTestId('loading-indicator')).not.toBeVisible();
    });

    test('verify image loading', async ({ page }, testInfo) => {
      await page.getByRole('link', { name: 'Holidays', exact: true }).click();
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  });

  test.describe('specialities', () => {
    test.only('or condition', async ({ page }) => {
      await page.getByRole('link', { name: 'Holidays', exact: true }).click();
      await page
        .getByTestId('holiday-card')
        .filter({ hasText: 'Wien' })
        .or(page.getByTestId('holiday-card').filter({ hasText: 'London' }))
        .getByRole('link')
        .first()
        .click();
    });
  });
});
