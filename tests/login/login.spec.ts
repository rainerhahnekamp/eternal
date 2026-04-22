import { test } from '../fixtures';

test('login', async ({ page }) => {
  await page.goto('');
  // login logic

  // await expect(page.getByText('Welcome John List')).toBeVisible()

  await page.context().storageState({ path: 'default-user.json' });
});
