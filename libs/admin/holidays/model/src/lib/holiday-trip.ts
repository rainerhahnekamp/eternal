import { Guide } from './guide';

export type HolidayTrip = {
  id: number;
  dates: { from: Date; to: Date };
  priceSingleRoom: number;
  priceDoubleRoom: number;
  guide: Guide;
};
