import { expect, test } from '@playwright/test';

test.describe('Holidays Administration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Admin CRUD', async ({ page }) => {
    await page.getByRole('link', { name: 'Administration' }).click();
    await expect.soft(page.getByTestId('row-holiday')).toHaveCount(2);

    await test.step('Add Holiday', async () => {
      await page.getByRole('link', { name: 'Add Holiday' }).click();
      await page.getByLabel('Name').fill('Japan');
      await page
        .getByLabel('Description')
        .fill(
          'The Land of the Rising Sun is a country where the past meets' +
            ' the future. Japanese culture stretches back millennia, yet has ' +
            'also been quick to adopt and created the latest modern fashions ' +
            'and trends.',
        );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect
        .soft(page.getByTestId('row-holiday').filter({ hasText: 'Japan' }))
        .toBeVisible();
    });

    await test.step('Edit Holiday', async () => {
      await page
        .getByTestId('row-holiday')
        .filter({ hasText: 'Japan' })
        .getByRole('link', { name: 'Edit' })
        .click();
      await page.getByLabel('Name').fill('Japan/Nippon');
      await page.getByRole('button', { name: 'Save' }).click();
      await expect
        .soft(
          page.getByTestId('row-holiday').filter({ hasText: 'Japan/Nippon' }),
        )
        .toBeVisible();
    });

    await test.step('Delete Holiday', async () => {
      await page
        .getByTestId('row-holiday')
        .filter({ hasText: 'Japan/Nippon' })
        .getByRole('link', { name: 'Edit' })
        .click();
      page.on('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'Delete' }).click();
      await expect.soft(page.getByTestId('row-holiday')).toHaveCount(2);
    });
  });
});
