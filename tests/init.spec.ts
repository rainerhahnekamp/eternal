import { expect } from '@playwright/test';
import { Sidebar } from './page-objects/sidebar';
import { HolidaysPage } from './page-objects/holidays-page';
import { test } from './fixtures'

const softExpect = expect.configure({soft: true});

test.describe('init', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await expect(page.getByText('Application is ready')).toBeVisible();
    })
    test('select Bali', async ({ page, sidebar }) => {
        await sidebar.open('Holidays')
        // await page.getByRole('link', { name: 'Holidays', exact: true }).click()
        await page.getByLabel('Bali').getByRole('link', { name: 'Brochure' }).click();
        await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5')
        await page.getByRole('button', { name: "Send" }).click();
        // await expect(page.getByRole('status')).
    });

})