import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { QuizService } from './quiz.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';

describe('QuizService', () => {
  it('should call the http client with the correct URL', () => {
    const httpClientMock = {
      get: jasmine.createSpy(),
    };

    const quizService = TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: HttpClient, useValue: httpClientMock },
      ],
    }).inject(QuizService);

    httpClientMock.get.and.returnValue(
      of({ title: '', timeInSeconds: 0, questions: [] }),
    );
    quizService.findById(1);
    expect(httpClientMock.get).toHaveBeenCalled();
  });
});
