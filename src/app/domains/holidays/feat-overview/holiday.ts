import { z } from 'zod';

export const holidaySchema = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().min(1),
  teaser: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  typeId: z.number().int().nonnegative(),
  durationInDays: z.number().int().positive(),
  minCount: z.number().int().nonnegative(),
  maxCount: z.number().int().nonnegative(),
  soldOut: z.boolean(),
  onSale: z.boolean(),
  hasQuiz: z.boolean(),
});

export type Holiday = z.infer<typeof holidaySchema>;

export function toHoliday(data: unknown) {
  const parseResult = holidaySchema.safeParse(data);
  if (parseResult.success) {
    return parseResult.data;
  } else {
    return undefined;
  }
}

export function toHolidays(response: unknown) {
  return z.array(holidaySchema).parse(response);
}

let id = 1;

export function createHoliday(holiday: Partial<Holiday> = {}): Holiday {
  return {
    ...{
      id: id++,
      title: 'Vienna',
      teaser: 'A holiday to Vienna',
      description:
        'This is the description of this holiday. Should be a little bit longer than the teaser',
      imageUrl: 'dummy.jpg',
      typeId: 1,
      durationInDays: 3,
      minCount: 5,
      maxCount: 12,
      soldOut: false,
      onSale: false,
      hasQuiz: false,
    },
    ...holiday,
  };
}

export function createHolidays(...holidays: Partial<Holiday>[]) {
  return holidays.map(createHoliday);
}
