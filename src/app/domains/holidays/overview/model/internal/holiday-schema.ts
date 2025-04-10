import { z } from 'zod';

export const holidaySchema = z.object({
  id: z.number(),
  title: z.string(),
  teaser: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  typeId: z.number(),
  durationInDays: z.number(),
  minCount: z.number(),
  maxCount: z.number(),
  soldOut: z.boolean(),
  onSale: z.boolean(),
  hasQuiz: z.boolean(),
});
