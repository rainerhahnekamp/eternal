import { expect } from '@playwright/test';
import { test } from '../fixtures';

test('sign in', async ({ page, context }) => {
  await page.goto('');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'email' }).fill('john.list');
  await page.getByRole('textbox', { name: 'Password' }).fill('John List');

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Welcome John List')).toBeVisible();

  await context.storageState({ path: 'john-list.json' });
});
