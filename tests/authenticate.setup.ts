import { test } from './test';
import { expect } from '@playwright/test';

test('authenticate', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('Application is ready')).toBeVisible();
  ``;
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('john.list');
  await page.getByRole('textbox', { name: 'Password' }).fill('John List');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Welcome John List')).toBeVisible();

  await page.context().storageState({ path: 'john-list.json' });
});
