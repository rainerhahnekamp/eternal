import { test, expect } from '@playwright/test';

for (const { name, width, height } of [
  { name: 'full hd', width: 1920, height: 1080 },
  { name: '4k', width: 3680, height: 2160 },
]) {
  test(`visual regression for ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto(
      'http://localhost:6006/iframe.html?id=holiday-card-component--primary&viewMode=story',
    );
    await expect
      .configure({ timeout: 10000 })(page)
      .toHaveScreenshot(`holiday-card-${name}.png`);
  });
}
