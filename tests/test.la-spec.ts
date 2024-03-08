import { test } from '@playwright/test';

test.describe('Latin America', () => {
  test('special greeting for special browser', async ({ page }) => {
    await page.goto('');
    await page.getByText('bienvenidos').waitFor();
  });

  test.describe('German Language', () => {
    test.use({ locale: 'de-AT' });
    test('special greeting for special browser', async ({ page }) => {
      await page.goto('');
      await page.getByText('Willkommen').waitFor();
    });
  });

  test.describe('jump to the other side of the world', () => {
    test.use({
      geolocation: { latitude: 35.02586, longitude: 135.7616 },
      locale: 'ja-jp',
    });
    test('special greeting for special browser', async ({ page }) => {
      await page.goto('');
      await page.getByText('We very welcome').waitFor();
    });
  });
});
