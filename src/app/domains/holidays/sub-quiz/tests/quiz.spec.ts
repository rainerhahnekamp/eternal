import { TestBed } from '@angular/core/testing';
import { QuizComponent } from '../quiz.component';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { QuizStore } from '../data/quiz-store';
import { createQuiz } from './create-quiz';
import { screen, within } from '@testing-library/angular';

describe('Quiz Feature', () => {
  it('should show correct status', async () => {
    TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideLocationMocks(),
        provideRouter(
          [
            {
              path: 'quiz/:id',
              component: QuizComponent,
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
