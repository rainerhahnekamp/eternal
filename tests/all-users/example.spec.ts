import { test } from '../fixtures';

const userTypes = ['anonymous', 'admin', 'default-user'];

for (const userType of userTypes) {
  test.use({ storageState: `${userType}.json` });
  test(`foo: ${userType}`, async ({ page }) => {
    await page.goto('');
  });
}
