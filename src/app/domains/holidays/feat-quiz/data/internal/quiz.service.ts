import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Quiz } from '../../model/model';
import z from 'zod';

export const quizApiSchema = z.object({
  id: z.number(),
  title: z.string(),
  timeInSeconds: z.number(),
  questions: z.array(
    z.object({
      id: z.number(),
      question: z.string(),
      explanation: z.string(),
      answers: z.array(
        z.object({
          id: z.number(),
          answer: z.string(),
          isCorrect: z.boolean(),
        }),
      ),
    }),
  ),
});

export type QuizApi = z.infer<typeof quizApiSchema>;

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly #httpClient = inject(HttpClient);

  findById(id: number): Promise<Quiz> {
    return firstValueFrom(
      this.#httpClient.get<QuizApi>(`/holiday/${id}/quiz`).pipe(map(toQuiz)),
    );
  }
}

export function toQuiz(data: unknown, holidayId: number): Quiz {
  const quiz = quizApiSchema.parse(data);

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
