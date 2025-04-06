import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { z } from 'zod';
import { Quiz } from './model';

const quizApiSchema = z.object({
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

export const parseQuizApi = (response: unknown) => {
  const result = quizApiSchema.safeParse(response);
  return result.success ? result.data : undefined;
};

@Injectable({ providedIn: 'root' })
export class QuizService {
  findById(id: () => number) {
    return httpResource(
      () => ({
        url: `/holiday/${id()}/quiz`,
      }),
      {
        parse: (response) => {
          const quizApi = parseQuizApi(response);
          return quizApi ? toQuiz(quizApi, id()) : undefined;
        },
      },
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
