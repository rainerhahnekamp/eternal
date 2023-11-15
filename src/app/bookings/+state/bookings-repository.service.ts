import { combineLatest, filter, map } from 'rxjs';
import { Booking, bookingsFeature } from './bookings.reducer';
import { isDefined } from '@app/shared/util';
import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomersApi } from '@app/customers/api';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { bookingsActions } from '@app/bookings/+state/bookings.actions';

interface BookingData {
  bookings: Booking[];
  customerName: string;
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookingsRepository {
  #store = inject(Store);
  #customersApi = inject(CustomersApi);

  #bookingsData: Signal<BookingData | undefined> = toSignal(
    combineLatest({
      customer: toObservable(this.#customersApi.selectedCustomer),
      bookings: this.#store.select(bookingsFeature.selectBookings),
      loaded: this.#store.select(bookingsFeature.selectLoaded),
    }).pipe(
      filter(({ customer }) => isDefined(customer)),
      map(({ customer, bookings, loaded }) => {
        return {
          customerName: customer?.name + ', ' + customer?.firstname,
          bookings,
          loaded,
        };
      }),
    ),
  );

  get bookingsData(): Signal<BookingData | undefined> {
    return this.#bookingsData;
  }

  load() {
    this.#store.dispatch(bookingsActions.load());
  }
}
