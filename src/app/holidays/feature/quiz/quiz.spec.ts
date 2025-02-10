import { TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { createQuiz } from '../tests/create-quiz';
import { screen, within } from '@testing-library/angular';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import userEvent from '@testing-library/user-event';

describe('Quiz Service', () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(
          [{ path: 'quiz/:id', component: QuizComponent }],
          withComponentInputBinding(),
        ),
        provideLocationMocks(),
      ],
    });

    const harness = await RouterTestingHarness.create('quiz/1');
    const ctrl = TestBed.inject(HttpTestingController);
    ctrl.expectOne('/holiday/1/quiz').flush(createQuiz(1));

    const status = screen.getByRole('region', { name: 'quiz-status' });
    await harness.fixture.whenStable();
    const question = screen.getByLabelText('question');

    expect(within(status).getByText('Correct: 0')).toBeTruthy();
    expect(within(status).getByText('Incorrect: 0')).toBeTruthy();
    return { fixture: harness.fixture, status, question };
  };

  it('should initialize', async () => {
    await setup();
  });

  it('should show that question was answered success', async () => {
    const { fixture, status, question } = await setup();

    within(question).getByRole('button', { name: 'TypeScript' }).click();

    await fixture.whenStable();

    expect(within(status).getByText('Correct: 1')).toBeTruthy();
    expect(within(status).getByText('Incorrect: 0')).toBeTruthy();
  });

  it('should enable the next button on answer', async () => {
    const { fixture, status, question } = await setup();
    const user = userEvent.setup();

    expect(
      screen
        .getByRole('button', { name: 'Next Question' })
        .getAttribute('disabled'),
    ).toBeTruthy();

    const clock = jasmine.clock();
    clock.install();

    await user.click(
      within(question).getByRole('button', { name: 'TypeScript' }),
    );

    clock.tick(1000);
    clock.uninstall();

    await fixture.whenStable();

    expect(
      screen
        .getByRole('button', { name: 'Next Question' })
        .getAttribute('disabled'),
    ).toBeFalsy();
  });
});
