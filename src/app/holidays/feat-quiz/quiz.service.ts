import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Quiz } from "@app/holidays/feat-quiz/model";
import { firstValueFrom, map } from "rxjs";

export interface QuizApi {
  id: number;
  title: string;
  timeInSeconds: number;
  questions: {
    id: number;
    question: string;
    explanation: string;
    answers: { id: number; answer: string; isCorrect: boolean }[];
  }[];
}

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
