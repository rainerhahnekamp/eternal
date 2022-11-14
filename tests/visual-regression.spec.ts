import { test, expect } from '@playwright/test';

test('playwright check', async ({ page }) => {
  await page.goto('https://www.orf.at');
});
