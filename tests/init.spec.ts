import { test } from './fixtures/test';
import { expect } from './matchers/expect';

test.describe.configure({ mode: 'serial' });
test.describe('Tests', () => {
  test('test 1', async ({ page, holidaysPage, sidemenuPage }) => {
    await page.goto('http://localhost:4200/');

    await expect(page.getByText('Welcome')).toBeVisible();

    await test.step('selection', async () => {
      await sidemenuPage.select('Holidays');
      await holidaysPage.getBrochureFor('Vienna');
    });

    await test.step('fill out form', async () => {
      await page.getByTestId('address').click();
      await page.getByTestId('address').fill('Domgasse 5');
      await page.getByTestId('btn-search').click();
      await page.getByTestId('lookup-result').click();
    });
  });

  test('test 2', async ({ page }) => {
    await page.goto('http://localhost:4200/');

    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
