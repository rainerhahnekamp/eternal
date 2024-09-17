import { Booking, bookingsFeature } from './bookings.reducer';
import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { bookingsActions } from '@app/bookings/+state/bookings.actions';

@Injectable({ providedIn: 'root' })
export class BookingsStore {
  #store = inject(Store);

  readonly bookings: Signal<Booking[]> = this.#store.selectSignal(
    bookingsFeature.selectBookings,
  );
  readonly loaded: Signal<boolean> = this.#store.selectSignal(
    bookingsFeature.selectLoaded,
  );

  load() {
    this.#store.dispatch(bookingsActions.load());
  }
}
