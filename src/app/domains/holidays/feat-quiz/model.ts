import { z } from 'zod';

export const answerStatusSchema = z.enum([
  'unanswered',
  'correct',
  'incorrect',
]);

export type AnswerStatus = z.infer<typeof answerStatusSchema>;

export const questionSchema = z.object({
  id: z.number(),
  question: z.string(),
  correctAnswer: z.number(),
  givenAnswer: z.union([z.undefined(), z.number()]),
  choices: z.array(z.object({ id: z.number(), text: z.string() })),
  explanation: z.string(),
});

export type Question = z.infer<typeof questionSchema>;

export const quizSchema = z.object({
  id: z.number(),
  holidayId: z.number(),
  title: z.string(),
  questions: z.array(questionSchema),
  timeInSeconds: z.number(),
});

export type Quiz = z.infer<typeof quizSchema>;
