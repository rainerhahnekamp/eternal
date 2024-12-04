import { provideHttpClient } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { createQuiz } from '../tests/create-quiz';
import { screen, within } from '@testing-library/dom';

describe('Quiz Service', () => {
  it('should show that question was answered success', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).createComponent(QuizComponent);

    fixture.componentRef.setInput('id', 1);
    fixture.autoDetectChanges(true);
    const httpClient = TestBed.inject(HttpTestingController);
    const req = httpClient.expectOne('/holiday/1/quiz');
    req.flush(createQuiz(1));
    await fixture.whenStable();

    const question = screen.getByLabelText('question');
    const status = screen.getByLabelText('quiz-status');

    expect(within(status).getByText('Correct: 0')).toBeTruthy();
    expect(
      within(question).getByText(
        'What programming language is Angular written in?',
      ),
    ).toBeTruthy();
    within(question).getByRole('button', { name: 'TypeScript' }).click();

    await fixture.whenStable();
    expect(within(status).getByText('Correct: 1')).toBeTruthy();
  });
});
