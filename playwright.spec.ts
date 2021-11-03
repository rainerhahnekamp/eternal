import { test } from '@playwright/test';

test(`systemcheck`, async ({ page }) => {
  await page.goto('http://google.com');
});
