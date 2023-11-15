import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=eternal-checker--check&viewMode=story',
  );
  await expect(page).toHaveScreenshot('checker.png');
});
