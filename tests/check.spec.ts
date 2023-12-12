import { expect, test as base } from '@playwright/test';
import {
  sidemenuFixtures,
  SidemenuFixtures,
} from './fixtures/sidemenu.fixtures';

const test = base.extend<SidemenuFixtures>(sidemenuFixtures);

test.describe('init', () => {
  test.only('request brochure', async ({ page, sidemenu }) => {
    await page.goto('');
    await sidemenu.open('Holidays');

    await page.getByTestId('address').fill('Domgasse 5');
    await page.getByTestId('btn-search').click();
    await expect(page.getByTestId('lookup-result')).toHaveText('Brochure sent');
  });

  test('has title', async ({ page }) => {
    await page.goto('');
    await page.locator('div');
  });
});
