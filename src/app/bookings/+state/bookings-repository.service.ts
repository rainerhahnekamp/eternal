import { Booking, bookingsFeature } from './bookings.reducer';
import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class BookingsRepository {
  #store = inject(Store);

  readonly bookings: Signal<Booking[]> = this.#store.selectSignal(
    bookingsFeature.selectBookings,
  );
  readonly loaded: Signal<boolean> = this.#store.selectSignal(
    bookingsFeature.selectLoaded,
  );
}
