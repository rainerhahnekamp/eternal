import { z } from 'zod';
import { holidaySchema } from './internal/holiday-schema';

export function parseHolidays(response: unknown): Holiday[] {
  const holidays = z.array(holidaySchema).safeParse(response);
  return holidays.success ? holidays.data : [];
}

export type Holiday = z.infer<typeof holidaySchema>;

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
