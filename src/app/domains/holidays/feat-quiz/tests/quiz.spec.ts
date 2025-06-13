import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { QuizStore } from '../data/quiz-store';
import { createQuiz } from './create-quiz';
import { screen, within } from '@testing-library/angular';
import { QuizPage } from '../quiz-page';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Quiz Feature', () => {
  it('should show correct status', async () => {
    TestBed.configureTestingModule({
      imports: [QuizPage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideLocationMocks(),
        provideRouter(
          [
            {
              path: 'quiz/:id',
              component: QuizPage,
            },
          ],
          withComponentInputBinding(),
        ),
        QuizStore,
      ],
    });

    const harness = await RouterTestingHarness.create('quiz/1');
    const ctrl = TestBed.inject(HttpTestingController);
    ctrl.expectOne('/holiday/1/quiz').flush(createQuiz(1));
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    // screen.getByRole
    const question = screen
      .getAllByLabelText('question')
      .find((question) => within(question).getByText(/programming language/));
    if (!question) {
      throw 'nix geht';
    }
    within(question).getByRole('button', { name: 'TypeScript' }).click();

    await harness.fixture.whenStable();
    expect(screen.getByText('Correct: 1')).toBeDefined();
  });
});
