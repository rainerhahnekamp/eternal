import { test, expect } from '@playwright/test'

test('login', async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', {name: 'email'}).fill('john.list');
    await page.getByRole('textbox', {name: 'password'}).fill('John List');
    await page.getByRole('button', {name: 'Sign in'}).click();
    await expect(page.getByText('Welcome John List')).toBeVisible();

    await page.context().storageState({path: 'john-list.json'})
})