import {test, expect} from "@playwright/test";

test.describe('Init', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('')
    });

    test('request brochure for Vienna', async ({ page }) => {
        await page.getByTestId('btn-holidays').click()
        await page.getByTestId('holiday-card').filter({ hasText: 'Vienna' }).getByTestId('btn-brochure').click();
        await page.getByTestId('')
    })

    test('request brochure', async ({ page }) => { 
        await page.getByRole('link', {name: 'Holidays', exact: true}).click();
        await page.getByLabel('Vienna').getByRole('link', {name: /Brochure/}).click();
        await page.getByRole('textbox', {name: 'Address'}).fill('Domgasse 5');
        await page.getByRole('button', {name: 'Send'}).click();

        await expect(page.getByRole('status')).toHaveText('Brochure sent')
    })

})