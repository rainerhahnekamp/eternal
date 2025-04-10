import { expect, test } from '@playwright/test';

test('quiz', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('link', { name: 'Holidays', exact: true }).click();
  await page
    .getByTestId('holiday-card')
    .filter({ hasText: 'India' })
    .getByRole('link', { name: 'quiz' })
    .click();

  await page
    .locator('app-quiz-question')
    .filter({ hasText: 'Which is the national tree of India?' })
    .getByRole('button', { name: 'Banyan' })
    .click();

  await expect(
    page
      .locator('app-quiz-question')
      .filter({ hasText: 'Which is the national tree of India?' }),
  ).toContainText('Right Answer');

  await expect(page.locator('app-quiz-status')).toContainText('Correct: 1');
});
