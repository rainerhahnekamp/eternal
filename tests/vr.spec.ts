import { test, expect } from '@playwright/test';

test('should vr sliderComponent', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=isolated-component--default-look&viewMode=story',
  );
  await expect(page).toHaveScreenshot('slider.png');
});
