import { expect } from '@playwright/test';
import { test } from '../fixtures';

test('address submit button should be disabled on invalid address', async ({
  page,
}) => {
  await page.goto('');

  await page.getByText('Application is ready').waitFor();

  // await shellPage.clickMenuItem('Holidays');
  await page.getByRole('link', { name: 'Holidays', exact: true }).click();
  await page.getByLabel('Bali').getByRole('link', { name: 'Brochure' }).click();

  // Pre-Condition
  await page.getByRole('textbox', { name: 'Address' }).fill('Hauptstrasse 1');
  await expect(page.getByRole('button', { name: 'Send' })).toBeEnabled();

  await page.getByRole('textbox', { name: 'Address' }).fill('Hauptstrasse');
  await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled();
});
