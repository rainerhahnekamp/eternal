import { QuizPage } from './quiz-page';
import { test, expect } from '@testronaut/angular';

test('should show the quiz', async ({ mount }) => {
  await mount(QuizPage);
});
