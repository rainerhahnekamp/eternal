


import {test, expect} from "@playwright/test"
test.describe('john-list', () => {
    test('john list should be signed in', async ({page}) => {
        await page.goto('');
        await expect(page.getByText('Application is ready')).toBeVisible();
        await expect(page.getByText('Welcome John List')).toBeVisible();
        await page.getByRole('link', {name: 'Holidays', exact: true}).click();
        await page.getByTestId('holiday-card').filter({hasText: 'xyz'}).waitFor()
    })
})
