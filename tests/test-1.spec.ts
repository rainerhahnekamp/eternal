import { expect } from '@playwright/test';
import { test } from './fixtures';

test('request brochure for Holiday London', async ({ page, shell }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Application is ready').waitFor();

  await shell.openItem('Holidays');
  await page
    .getByLabel('London')
    .getByRole('link', { name: 'Brochure' })
    .click();
  await page.getByRole('textbox', { name: 'Address' }).fill('Hauptstrasse 1');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByRole('status')).toContainText('Brochure sent');
});

test('vr', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await expect(page.getByText('Application is ready')).toBeVisible();

  const holidayDüsseldorf = [
    {
      id: 16,
      title: 'Düsseldorf',
      teaser:
        'Uncover Bali, where lush jungles, serene temples, and golden beaches await.',
      description:
        'Enjoy a 12-day journey through Bali’s hidden waterfalls, serene beaches, and vibrant cultural sites—from Ubud’s lush landscapes to iconic temples.',
      imageUrl: 'https://api.eternal-holidays.net/assets/bali.jpg',
      typeId: 1,
      durationInDays: 12,
      minCount: 6,
      maxCount: 18,
      onSale: false,
      soldOut: false,
      hasQuiz: true,
    },
  ];
  await page.route('https://api.eternal-holidays.net/holiday', (route) => {
    route.fulfill({
      status: 200,
      json: holidayDüsseldorf,
    });
  });

  await page.getByTestId('btn-holidays').click();

  await expect(page.getByTestId('holiday-card').first()).toHaveScreenshot(
    'bali.png',
    { mask: [page.locator('mat-card-title')], maskColor: 'white' },
  );
});
