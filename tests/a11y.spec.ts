import { expect } from '@playwright/test';
import { test } from './fixtures';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('A11y', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
  });

  test.describe('axe check', () => {
    test('landing page', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
    test('holidays', async ({ page, sidemenuPage }) => {
      await sidemenuPage.select('Holidays');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .include('app-holidays')
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test('sidebar matches accessibility tree', async ({ page }) => {
    await expect(page.locator('mat-drawer')).toMatchAriaSnapshot(`
          - list:
            - listitem:
              - link "Holidays"
            - listitem:
              - link "Customers"
            - listitem:
              - link "Bookings"
            - listitem:
              - link "Newsletter"
          `);
  });

  test('assert sign in button has accessible name', async ({ page }) => {
    const signInButton = page.getByTestId('btn-sign-in');
    await expect(signInButton).toHaveAccessibleName('Sign In');
    await expect(signInButton).toHaveRole('button');
  });

  test('keyboard navigation', async ({ page, sidemenuPage, customersPage }) => {
    await sidemenuPage.select('Customers');
    await customersPage.edit('Latitia');
    const firstname = page.getByRole('textbox', { name: 'Firstname' });
    await firstname.focus();

    for (const _ of 'titia') {
      await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('etitia');

    for (const _ of [
      'Name',
      'Country',
      'Birthday',
      'Calendar Icon',
      'Back',
      'Delete',
      'Save',
    ]) {
      await page.keyboard.press('Tab');
    }
    await page.keyboard.press('Enter');

    await expect(customersPage.rowByName('Laetitia')).toBeVisible();
  });
});
