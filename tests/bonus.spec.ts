import { test, expect } from '@playwright/test';

test.describe('bonus tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });

  test.describe('failing tests', () => {
    test('should rename Renate Hoffmann to Renate Hofman', async ({ page }) => {
      await page.getByTestId('btn-customers').click();
      await page
        .getByTestId('row-customer')
        .filter({ hasText: 'Renate Hoffmann' })
        .getByTestId('btn-edit')
        .click();

      // await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
      await expect(page.getByTestId('inp-name')).toHaveValue('Hoffmann');

      await page.getByTestId('inp-name').fill('Hofman');
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(
        page.locator('data-testid=row-customer', { hasText: 'Renate Hofman' }),
      ).toBeVisible();
    });

    test('should use a synchronous assertion', async ({ page }) => {
      await page.getByTestId('btn-customers').click();
      await expect(page.getByTestId('row-customer')).toHaveCount(10);
      const name = await page
        .getByTestId('row-customer')
        .getByTestId('name')
        .first()
        .textContent();

      expect(name).toBe('Latitia');
      // await page.getByTestId('row-customer').last().waitFor();
      // const customersCount = await page.getByTestId('row-customer').count();
      // expect(customersCount).toBe(10);
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
      await expect(page.getByTestId('row-customer').first()).toBeVisible();

      await expect(
        page.getByTestId('row-customer').filter({ hasText: 'Knut Eggen' }),
      ).not.toBeVisible();
    });

    test('loading indicator', async ({ page }) => {
      await page.getByTestId('btn-customers').click();
      await expect(page.getByTestId('loading-indicator')).toBeVisible();
      await expect(page.getByTestId('row-customer').first()).toBeVisible();
      await expect(page.getByTestId('loading-indicator')).not.toBeVisible();
    });

    test('verify image loading', async ({ page }, testInfo) => {
      await test.step('go to holidays', async () => {
        await page.getByRole('link', { name: 'Holidays', exact: true }).click();
        await expect(page.getByTestId('holiday-card').first()).toBeVisible();
      });

      await test.step('load images', async () => {
        const holidayCardCount = await page.getByTestId('holiday-card').count();
        for (let i = 0; i < holidayCardCount; i++) {
          await expect(
            page.getByTestId('holiday-card').locator('img').nth(i),
          ).toHaveJSProperty('complete', true);
          await expect(
            page.getByTestId('holiday-card').locator('img').nth(i),
          ).not.toHaveJSProperty('naturalWidth', 0);
        }
      });

      await test.step('attach screenshot', async () => {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  });

  test.describe('specialities', () => {
    test.only('or condition', async ({ page }) => {
      await page.getByRole('link', { name: 'Holidays', exact: true }).click();
      await page
        .getByTestId('holiday-card')
        .filter({ hasText: 'Wien' })
        .or(page.getByTestId('holiday-card').filter({ hasText: 'Vienna' }))
        .getByRole('link')
        .click();
    });
  });
});
