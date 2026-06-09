import { Booking, bookingsFeature } from './bookings.reducer';
import { inject, Service, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { bookingsActions } from './bookings.actions';

@Service()
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
