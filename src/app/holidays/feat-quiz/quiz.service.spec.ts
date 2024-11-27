import { QuizService } from './quiz.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { QuizStore } from './quiz-store';
import { of } from 'rxjs';

it('should test QuizService', () => {
  const httpClient = {
    get: jasmine.createSpy(),
  };

  const quizService = TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: httpClient,
      },
    ],
  }).inject(QuizService);
  httpClient.get.and.returnValue(
    of({
      id: 1,
      title: 'Angular Quiz',
      timeInSeconds: 60,
      questions: [],
    }),
  );
  quizService.findById(1);

  expect(httpClient.get).toHaveBeenCalledWith('/holiday/1/quiz');
});
