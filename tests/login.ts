import { test, expect } from '@playwright/test';

// login for John List

test('login for John List', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('Application is ready')).toBeVisible();
  await page.context().storageState({ path: 'john.list.json' });
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'User' }).fill('john.list');
  await page.getByRole('textbox', { name: 'Password' }).fill('John List');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Welcome John List')).toBeVisible();
});
