import { test } from './fixtures/test';
import { expect } from './matchers/expect';

test('sign in', async ({ page }) => {
  await page.goto('');
  await page.getByText('Application is ready').waitFor();

  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Username').fill('john.list');
  await page.getByLabel('Password').fill('John List');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Welcome John List')).toBeVisible();
  await page.context().storageState({ path: 'john-list.json' });
});
