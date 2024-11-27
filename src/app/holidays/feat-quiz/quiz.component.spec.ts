import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuizStore } from './quiz-store';

it('should unit test the quiz component', () => {
  const quizStore = {
    title: signal('Quiz'),
    setId: jasmine.createSpy(),
    answer: jasmine.createSpy(),
  };

  const fixture = TestBed.overrideComponent(QuizComponent, {
    set: {
      providers: [{ provide: QuizStore, useValue: quizStore }],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    },
  }).createComponent(QuizComponent);

  const component = fixture.componentInstance;
  component.handleAnswer(1, 2);

  expect(quizStore.answer).toHaveBeenCalledWith(1, 2);
});
