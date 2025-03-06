import { TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import {
  NO_ERRORS_SCHEMA,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { QuizStore } from './data/quiz-store';

describe('Quiz Component', () => {
  it('should call handleAnswer', () => {
    const quizStore = {
      setId: jasmine.createSpy(),
      answer: jasmine.createSpy(),
    };

    TestBed.overrideComponent(QuizComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });
    const fixture = TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: QuizStore,
          useValue: quizStore,
        },
      ],
    }).createComponent(QuizComponent);

    fixture.componentInstance.handleAnswer({ questionId: 1, choiceId: 2 });
    expect(quizStore.answer).toHaveBeenCalledWith(1, 2);
  });
});
