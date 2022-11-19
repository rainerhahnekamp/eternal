import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map } from 'rxjs';
import { Booking } from './bookings.reducer';
import { CustomersApi } from '@eternal/customers/api';
import { bookingsActions } from './bookings.actions';

const bookings: Map<number, Booking[]> = new Map<number, Booking[]>();
bookings.set(1, [
  {
    id: 1,
    holidayId: 1,
    bookingDate: new Date(2022, 1, 2),
    status: 'pending',
    comment: "A little bit unsure about the holiday. Let's see",
  },
  {
    id: 2,
    holidayId: 2,
    bookingDate: new Date(2022, 1, 2),
    status: 'cancelled',
    comment: 'Seemed to be a little bit stressed out',
  },
]);
bookings.set(3, [
  {
    id: 3,
    holidayId: 1,
    bookingDate: new Date(2022, 1, 2),
    status: 'finished',
    comment:
      "According to Jeremy, he's a quite a grumbler. Complains all the time and nothing seems to be satisfactory.",
  },
]);

@Injectable()
export class BookingsEffects {
  #customersApi = inject(CustomersApi);

  selectedCustomer$ = createEffect(() => {
    return this.#customersApi.selectedCustomer$.pipe(
      map(({id}) => bookingsActions.loaded({ bookings: bookings.get(id) || [] }))
    );
  });
}
