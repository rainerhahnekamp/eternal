export * from './bookingsController.service';
import { BookingsControllerService } from './bookingsController.service';
export * from './holidays.service';
import { HolidaysService } from './holidays.service';
export const APIS = [BookingsControllerService, HolidaysService];
