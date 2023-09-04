import { Guide } from './guide';

export type HolidayTrip = {
  id: number;
  fromData: Date;
  toDate: Date;
  priceSingleRoom: number;
  priceDoubleRoom: number;
  guide: Guide;
};
