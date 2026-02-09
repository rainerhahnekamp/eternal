import { QuizPage } from '../quiz-page';
import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { createQuestion, createQuiz } from './create-quiz';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

const quiz = createQuiz(
  1,
  { title: 'Angular Quiz' },
  createQuestion(
    'In which programming language was Angular created?',
    'TypeScript',
    ['Java', 'TypeScript', 'Python', 'JavaScript'],
    'Angular was created in TypeScript',
  ),
  createQuestion(
    'What was the default testing framework for Angular?',
    'Jasmine',
    ['Jasmine', 'Mocha', 'Jest', 'TestCafe'],
    'Jasmine was the default testing framework for Angular',
  ),
);

describe('Quiz Page', () => {
  it('should load the quiz', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'quiz/:id', component: QuizPage }],
          withComponentInputBinding(),
        ),
        provideLocationMocks(),
        provideHttpClientTesting(),
      ],
    });

    await RouterTestingHarness.create('quiz/1');
    const ctrl = TestBed.inject(HttpTestingController);

    ctrl
      .expectOne({
        method: 'GET',
        url: '/holiday/1/quiz',
      })
      .flush(quiz);

    expect(true).toBe(true);
  });
});
