import { inject, Injectable } from '@angular/core';
import { Quiz } from '@app/holidays/feature/quiz/model';
import { questionsIndia } from '@app/holidays/feature/quiz/data/questions-india';
import { questionsNorway } from '@app/holidays/feature/quiz/data/questions-norway';
import { questionsEgypt } from '@app/holidays/feature/quiz/data/questions-egypt';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

const questions = [...questionsIndia, ...questionsNorway, ...questionsEgypt];

export type QuizApi = {
  id: number;
  title: string;
  timeInSeconds: number;
  questions: Array<{
    id: number;
    question: string;
    explanation: string;
    answers: Array<{ id: number; answer: string; isCorrect: boolean }>;
  }>;
};

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly #httpClient = inject(HttpClient);

  findById(id: number): Promise<Quiz> {
    return firstValueFrom(
      this.#httpClient
        .get<QuizApi>(`http://localhost:8080/holiday/${id}/quiz`)
        .pipe(map(toQuiz)),
    );
  }
}

function toQuiz(quiz: QuizApi, holidayId: number): Quiz {
  return {
    title: quiz.title,
    timeInSeconds: quiz.timeInSeconds,
    loaded: true,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      holidayId,
      question: question.question,
      explanation: question.explanation,
      status: 'unanswered',
      answer: question.answers.find((answer) => answer.isCorrect)!.id,
      choices: question.answers.map((answer) => ({
        id: answer.id,
        text: answer.answer,
      })),
    })),
  };
}

export function shuffleArray<T>(array: T[]) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}
