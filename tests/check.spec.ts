import { expect, test as base } from '@playwright/test';
import {
  sidemenuFixture,
  SidemenuFixtures,
} from './fixtures/sidemenu.fixtures';

const test = base.extend<SidemenuFixtures>({ sidemenuFixture });

test.describe('init', () => {
  test.only('request brochure', async ({ page, sidemenu }) => {
    await page.goto('');
    await sidemenu.open('Holidays');
    await page
      .locator('app-holiday-card', { hasText: 'Vienna' })
      .or(page.locator('app-holiday-card', { hasText: 'Wien' }))
      .getByTestId('btn-brochure')
      .click();

    await page.getByTestId('address').fill('Domgasse 5');
    await page.getByTestId('btn-search').click();
    await expect(page.getByTestId('lookup-result')).toHaveText('Brochure sent');
  });

  test('has title', async ({ page }) => {
    await page.goto('');
    await page.locator('div');
  });
});
