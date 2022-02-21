import { test } from '@playwright/test';

test(`systemcheck`, async ({ page }) => {
  await page.goto('https://www.orf.at');
});
