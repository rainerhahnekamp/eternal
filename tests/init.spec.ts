import { expect } from '@playwright/test';
import { test } from './fixtures';

const longExpect = expect.configure({ timeout: 10000 });

function translate(key: string) {
  return key;
}

test.describe('init', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });

  test('test', async ({ page, shell, holidaysPage }) => {
    await shell.openHolidays();
    await holidaysPage.gotoBrochure('Canada');

    await page.getByRole('textbox', { name: 'Address' }).fill('Entenplatz 2');
    await page.keyboard.press('Enter');

    await longExpect(page.getByRole('status')).toContainText('Brochure sent');
    console.log('Beende Test');
  });

  test('rename Latitia to Laetitia', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    await page
      .getByRole('table', { name: 'Customers' })
      .getByRole('row')
      .filter({ hasText: 'Latitia' })
      .getByRole('link', { name: 'Edit' })
      .click();
    await page.getByRole('combobox').click();
    await page
      .getByRole('listbox')
      .getByRole('option', { name: 'Italy' })
      .click();
  });

  test('use parent engine', async ({ page, shell }) => {
    await shell.openHolidays();
    await expect(
      page
        .getByTestId('holiday-card')
        .getByText('Bali')
        .first()
        .locator('parent=app-holiday-card'),
    ).toBeVisible();
  });
});
