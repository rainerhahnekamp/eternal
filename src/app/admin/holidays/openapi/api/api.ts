export * from './bookingController.service';
import { BookingControllerService } from './bookingController.service';
export * from './holiday.service';
import { HolidayService } from './holiday.service';
export const APIS = [BookingControllerService, HolidayService];
