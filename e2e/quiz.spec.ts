import { test, expect } from '@playwright/test'

test('should do the quiz', async ({ page }) => {
  await page.goto('');
  await page.getByRole('link', { name: 'Holidays', exact: true }).click();
  await page.getByLabel('Norway').getByRole('link', { name: 'Quiz' }).click();
  await page.
    getByRole('region', { name: 'What is the capital' }).
    getByRole('button', { name: 'Oslo' }).
    click();

  await expect(page.getByRole('status', { name: 'correct', exact: true })).
    toHaveText('Correct: 1')

  await expect(page.getByRole('status', { name: 'incorrect', exact: true })).
    toHaveText('Incorrect: 0')


})