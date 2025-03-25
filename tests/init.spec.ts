import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures';

test('init', async ({ page }) => {
  await test.step('test1', async () => {
    await page.goto('http://localhost:4200/');
    await expect(page.getByText('Application is ready')).toBeVisible();

    // await sidemenu.open('Holidays')

    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByTestId('holiday-card')
      .getByText('Canada')
      .locator('xpath=../../..');
  });

  await test.step('rename Latitia to Laetitia', async () => {
    await page.getByTestId('btn-customers').click();

    await page
      .locator('[data-testid=row-customer]', { hasText: 'Latitia' })
      .getByTestId('btn-edit')
      .click();
    await page.getByTestId('inp-firstname').fill('Laetitia');
    await page.getByTestId('inp-name').fill('Bellitissa-Wagner');
    await page.getByTestId('sel-country').click();
    await page.getByText('Austria').click();
    await page.getByTestId('btn-submit').click();

    await expect(
      page.locator('data-testid=row-customer', {
        hasText: 'Bellitissa-Wagner',
      }),
    ).toBeVisible();
  });

  await test.step('rename Laetitia to Latitia', async () => {
    await page.getByTestId('btn-customers').click();

    await page
      .locator('[data-testid=row-customer]', { hasText: 'Latitia' })
      .getByTestId('btn-edit')
      .click();
    await page.getByTestId('inp-firstname').fill('Laetitia');
    await page.getByTestId('inp-name').fill('Bellitissa-Wagner');
    await page.getByTestId('sel-country').click();
    await page.getByText('Austria').click();
    await page.getByTestId('btn-submit').click();

    await expect(
      page.locator('data-testid=row-customer', {
        hasText: 'Bellitissa-Wagner',
      }),
    ).toBeVisible();
  });
});
