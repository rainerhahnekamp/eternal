import { HolidayTrip } from './holiday-trip';

export type Holiday = {
  id: number;
  name: string;
  description: string;
  hasCover: boolean;
  coverLink: string;
};

let id = 1;

export function createHoliday(holiday: Partial<Holiday> = {}): Holiday {
  return {
    ...{
      id: id++,
      name: 'Vienna',
      description: 'A holiday to Vienna',
      hasCover: false,
      coverLink: '',
    },
    ...holiday,
  };
}

export function createHolidays(...holidays: Partial<Holiday>[]): Holiday[] {
  return holidays.map(createHoliday);
}
