import { httpResource } from '@angular/common/http';
import { Injectable, isSignal, Signal } from '@angular/core';
import { Quiz, quizSchema } from '../model/model';
import { z } from 'zod';

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

type QuizApi = z.infer<typeof quizApiSchema>;

function getFromValueOrFunction<T>(
  valueOrFunction: T | (() => T | undefined),
): T | undefined {
  if (typeof valueOrFunction === 'function') {
    return (valueOrFunction as () => T | undefined)();
  } else {
    return valueOrFunction;
  }
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  findById(id: number | (() => number | undefined)) {
    return httpResource(
      () => {
        const value = getFromValueOrFunction(id);
        if (value === undefined) {
          return undefined;
        }

        return {
          url: `/holiday/${value}/quiz`,
        };
      },
      {
        parse: (quiz) =>
          toQuiz(quizApiSchema.parse(quiz), getFromValueOrFunction(id)!),
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
