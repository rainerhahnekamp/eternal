import { HolidayFilter } from '../model/model';

export interface HolidaysStoreState {
  isLoaded: boolean;
  filter: HolidayFilter;
}
