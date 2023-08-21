import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe('network', () => {
  test('should mock customers request with Isabell Sykora', async ({
    page,
    customersPage,
    sidemenuPage,
  }) => {
    await page.goto('');
    await page.getByRole('switch', { name: 'Mock Customers' }).click();
    page.route(
      'https://api.eternal-holidays.net/customers?page=0&pageSize=10',
      (req) =>
        req.fulfill({
          json: {
            content: [
              {
                firstname: 'Isabell',
                name: 'Sykora',
                birthdate: '1984-05-30',
                country: 'AT',
              },
            ],
            total: 1,
          },
        }),
    );

    await sidemenuPage.select('Customers');
    await expect(customersPage.rowsLocator).toHaveCount(1);
  });
});
