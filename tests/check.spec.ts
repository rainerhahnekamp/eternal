import { expect, test as base } from '@playwright/test';
import {
  sidemenuFixtures,
  SidemenuFixtures,
} from './fixtures/sidemenu.fixtures';
import { holidaysFixture, HolidaysFixtures } from './fixtures/holiday.fixture';
import { createHoliday } from '@app/holidays/model';

const test = base.extend<SidemenuFixtures & HolidaysFixtures>({
  ...sidemenuFixtures,
  ...holidaysFixture,
});

test.describe('init', () => {
  test('request brochure', async ({ page, sidemenu, holidays }) => {
    await page.goto('');
    page.route('https://api.eternal-holidays.net/holiday', (route) =>
      route.fulfill({
        status: 200,
        json: [createHoliday({ title: 'Rome' })],
      }),
    );
    await sidemenu.open('Holidays');

    await holidays.getBrochureFor('Rome');
    await page.getByTestId('address').fill('Domgasse 5');
    await page.getByTestId('btn-search').click();
    await expect(page.getByTestId('lookup-result')).toHaveText('Brochure sent');
  });

  test('hover', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('btn-holidays').hover();

    await expect(page.getByTestId('home')).toHaveScreenshot('sidemenu.png');
  });
});
