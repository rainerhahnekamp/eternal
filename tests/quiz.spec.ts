import { test, expect } from '@playwright/test';
import { createQuiz } from 'src/app/domains/holidays/sub-quiz/tests/create-quiz';

test('should show Correct: 1', async ({ page }) => {
  await page.goto('');
  await page.getByText('Application is ready').waitFor();
  await page.getByRole('link', { name: 'Holidays', exact: true }).click();
  await page.route(
    'https://api.eternal-holidays.net/holiday/16/quiz',
    (request) => {
      return request.fulfill({
        json: createQuiz(16),
      });
    },
  );
  await page.clock.install();
  await page.getByLabel('Bali').getByRole('link', { name: 'Quiz' }).click();

  await page
    .getByLabel('question')
    .filter({ hasText: 'programming language' })
    .getByRole('button', { name: 'TypeScript' })
    .click();

  await expect(page.getByText('Correct: 1')).toBeVisible();

  await page.clock.runFor(280 * 1000);
  await expect(page.getByText('Time is up!')).toBeVisible();
});
