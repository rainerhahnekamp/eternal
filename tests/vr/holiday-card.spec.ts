import {test, expect} from "@playwright/test";


test('vr for holiday card', async ({page}) => {
    await page.goto('/holidays');
    await expect(page.getByLabel('India')).toHaveScreenshot('india.png')
})