import { test } from '@playwright/test';

test.describe('Mexico', () => {
  test('special greeting for special browser', async ({ page }) => {
    await page.goto('');
    await page.getByText('bienvenidos').waitFor();
  });

  test.describe('jump to the other side of the world', () => {
    test.use({
      geolocation: { latitude: 35.02586, longitude: 135.7616 },
      locale: 'ja-jp',
      timezoneId: 'IST',
    });
    test('special greeting for special browser', async ({ page }) => {
      await page.goto('');
      await page.getByText('We very welcome').waitFor();
    });
  });
});
