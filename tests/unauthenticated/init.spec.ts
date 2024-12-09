import { expect } from '@playwright/test';
import { test } from '../test';

test.describe('init', () => {
  test('aria snapshot', async ({ page }) => {
    await test.step('init', async () => {
      await page.goto('');
      await expect(page.getByText('Application is ready')).toBeVisible();
    });

    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await test.step('verification', async () => {
      const holidaysButton = page.getByTestId('btn-holidays');

      await Promise.all([
        expect.soft(holidaysButton).toHaveRole('button'),
        expect.soft(holidaysButton).toHaveAccessibleName('asdf'),
      ]);
    });

    await expect(page.locator('mat-drawer')).toMatchAriaSnapshot(`
        - list:
          - listitem:
            - link "Holidays"
        `);
  });
  test('select', async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();

    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByLabel('Bali')
      .getByRole('link', { name: 'Brochure' })
      .click();
    await page.getByRole('textbox', { name: 'Address' }).fill('asdf 1');

    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByRole('status')).toContainText('Brochure sent');

    // await page.keyboard.press('Tab');
    // await page.keyboard.press('Tab');
    // await page.keyboard.press('Enter');
  });
});
