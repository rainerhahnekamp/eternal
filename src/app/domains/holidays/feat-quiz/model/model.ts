import { z } from 'zod';

export const answerStatusSchema = z.enum([
  'unanswered',
  'correct',
  'incorrect',
]);

export type AnswerStatus = z.infer<typeof answerStatusSchema>;

export const questionSchema = z.object({
  id: z.number(),
  holidayId: z.number(),
  question: z.string(),
  answer: z.number(),
  choices: z.array(z.object({ id: z.number(), text: z.string() })),
  explanation: z.string(),
  status: answerStatusSchema,
});

export type Question = z.infer<typeof questionSchema>;

export const quizSchema = z.object({
  title: z.string(),
  questions: z.array(questionSchema),
  timeInSeconds: z.number(),
});

export type Quiz = z.infer<typeof quizSchema>;

let currentId = 1;

export const createQuestion = (
  question: string,
  solution: string,
  choices: string[],
  explanation: string,
  holidayId: number,
): Question => {
  return {
    id: currentId++,
    holidayId,
    question,
    answer: 1,
    choices: [
      { id: 1, text: solution },
      ...choices.map((choice, ix) => ({ id: ix + 2, text: choice })),
    ],
    explanation,
    status: 'unanswered',
  };
};
