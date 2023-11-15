import { inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { map } from 'rxjs';
import { bookingsActions } from './bookings.actions';
import { Booking } from './bookings.reducer';
import { CustomersApi } from '@app/customers/api';
import { toObservable } from '@angular/core/rxjs-interop';
import { filterDefined } from '@app/shared/ngrx-utils';

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
  #actions$ = inject(Actions);
  #selectedCustomer = toObservable(this.#customersApi.selectedCustomer);

  load$ = createEffect(() => {
    return this.#selectedCustomer.pipe(
      filterDefined,
      map((customer) =>
        bookingsActions.loaded({ bookings: bookings.get(customer.id) || [] }),
      ),
    );
  });
}
