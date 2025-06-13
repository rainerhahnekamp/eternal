import { TestBed } from '@angular/core/testing';
import { QuizStore } from './data/quiz-store';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { createQuiz } from './tests/create-quiz';
import { assertDefined } from '../../../shared/util/assert-defined';

describe('QuizStore', () => {
  it('should be check for correct and incorrect', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });

    const quiz = createQuiz(1);
    const rightAnswer = quiz.questions[0].answers.find((a) => a.isCorrect)?.id;
    const wrongAnswer = quiz.questions[0].answers.find((a) => !a.isCorrect)?.id;
    assertDefined(rightAnswer);
    assertDefined(wrongAnswer);

    const store = TestBed.inject(QuizStore);
    store.loadQuiz(1);
    await new Promise((resolve) => setTimeout(resolve));
    const ctrl = TestBed.inject(HttpTestingController);

    ctrl.expectOne('/holiday/1/quiz').flush(quiz);
    await new Promise((resolve) => setTimeout(resolve));
    expect(store.questions().length).toBe(2);

    store.handleAnswer({ questionId: 1, choiceId: rightAnswer });
    expect(store.quizStatus()).toEqual({
      correct: 1,
      incorrect: 0,
      unanswered: 1,
    });

    store.handleAnswer({ questionId: 1, choiceId: wrongAnswer });
    expect(store.quizStatus()).toEqual({
      correct: 0,
      incorrect: 1,
      unanswered: 1,
    });
  });
});
