import { test } from './fixtures';
import { expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { createHolidays } from 'src/app/domains/holidays/model/holiday';

test.describe('a11y', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install();
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });
  test('a11y for holidays', async ({ page, shell }) => {
    await shell.openHolidays();

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations.length).toEqual(0);
    expect(results.violations.length).toBe(0);
  });

  test('aria snapshot', async ({ page }) => {
    await expect(page.locator('mat-drawer')).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - link "Holidays"
      - listitem:
        - link "Bookings"
      - listitem:
        - link "Newsletter"
    `);
  });

  test('Esslingen in überschrift', async ({ page, shell }) => {
    await shell.openHolidays();
    await expect(page.getByTestId('holiday-card')).toHaveCount(16);

    const holidayName = 'Esslingen';
    await page.evaluate(
      ({ holidayName }) => {
        const card = document.querySelector(
          '[data-testid=holiday-card] mat-card-title',
        );
        if (card) {
          card.innerHTML = holidayName;
        }
        return true;
      },
      { holidayName },
    );
  });

  test('Quiz', async ({ page, shell }) => {
    await shell.openHolidays();
    await page
      .getByTestId('holiday-card')
      .filter({ hasText: 'Wien' })
      .getByRole('link', { name: 'Quiz' })
      .click();
    await expect(page.getByText(/Time Left: \d{3}/)).toBeVisible();
    await page.clock.runFor('05:00');
    await expect(page.getByText('Time is up!')).toBeVisible();
  });

  test('holidays request', async ({ page, shell, request }) => {
    await page.route(
      'https://api.eternal-holidays.net/holiday',
      (route, request) => {
        route.fulfill({
          status: 200,
          json: createHolidays({ title: 'Esslingen' }, { title: 'Stuttgart' }),
        });
      },
    );

    await shell.openHolidays();
    await expect(page.getByTestId('holiday-card')).toHaveCount(2);
  });

  test('do login', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('john.list');
    await page.getByRole('textbox', { name: 'Password' }).fill('John List');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Welcome John List')).toBeVisible();

    await page.context().storageState({ path: 'john-list.json' });
  });

  test.describe('signed in', () => {
    test.use({ storageState: 'john-list.json' });
    test('should be signed in', async ({ page }) => {
      await expect(page.getByText('Welcome John List')).toBeVisible();
    });
  });
});
