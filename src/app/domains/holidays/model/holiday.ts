import z from 'zod';

const holidaySchema = z.object({
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

export type Holiday = z.infer<typeof holidaySchema>;

export function parseHolidays(value: unknown): Holiday[] {
  return holidaySchema.array().parse(value);
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
