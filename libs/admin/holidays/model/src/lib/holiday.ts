import { HolidayTrip } from './holiday-trip';

export type Holiday = {
  id: number;
  name: string;
  description: string;
  trips: HolidayTrip[];
};
