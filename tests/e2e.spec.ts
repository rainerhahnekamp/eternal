import { test, expect } from '@playwright/test';
import {AxeBuilder} from '@axe-core/playwright'

test.describe('a11y', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('a11y selectors', async ({ page, request }) => {
    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByRole('grid', { name: 'Holidays' })
      .getByRole('gridcell', { name: 'Bali' })
      .getByRole('link', { name: 'Brochure' })
      .click();

    await page.getByRole('textbox', { name: 'Address' }).fill('Haupstrasse 1');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByRole('status')).toContainText('Brochure sent');
  });

  test('keyboard navigation', async ({ page, request }) => {
    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByRole('grid', { name: 'Holidays' })
      .getByRole('gridcell', { name: 'Bali' })
      .getByRole('link', { name: 'Brochure' })
      .click();

    await page.getByRole('textbox', { name: 'Address' }).focus();
    await page.keyboard.press('H')
    await page.keyboard.press(' ')
    await page.keyboard.press('1')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
  
    await expect(page.getByRole('status')).toContainText('Brochure sent');
  });

  test('axe', async ({page}) => {
    const report = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(report.violations).toHaveLength(0)
  })

  test('a11y matchers', async ({page}) => {
    await expect(page.getByTestId('btn-holidays')).toHaveAccessibleName('Holidays')
  })

  test('aria snapshot', async ({page}) => {
    await expect(page.locator('mat-drawer')).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "Holidays"
        - listitem:
          - link "Kunden"
        - listitem:
          - link "Newsletter"
      `);
  })
});
