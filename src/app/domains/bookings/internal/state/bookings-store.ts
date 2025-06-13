import { signalStore, type, withState } from '@ngrx/signals';
import {
  eventGroup,
  Events,
  on,
  withEffects,
  withReducer,
} from '@ngrx/signals/events';
import { Booking } from '../+state/bookings.reducer';
import { inject } from '@angular/core';
import { filter, map, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { bookings } from '../+state/bookings.effects';

export const bookingEvents = eventGroup({
  source: 'Booking',
  events: {
    load: type<void>(),
    loaded: type<{ bookings: Booking[] }>(),
    reset: type<void>(),
  },
});

export const BookingsStore = signalStore(
  { providedIn: 'root' },
  withState({
    bookings: [] as Booking[],
    loaded: false,
  }),
  withEffects(() => {
    const events = inject(Events);

    return {
      load$: events.on(bookingEvents.load).pipe(
        tap((value) => console.log(`id: ${value}`)),
        filter(Boolean),
        map(() => bookingEvents.loaded({ bookings: bookings.get(1) || [] })),
      ),
    };
  }),
  withReducer(
    on(bookingEvents.loaded, ({ payload }) => ({
      bookings: payload.bookings,
      loaded: true,
    })),
  ),
);

const events = new Subject<string>();

class Service1 {
  constructor() {
    events.pipe(tap((value) => console.log('Service 1: ${value}'))).subscribe();
  }
}

class Service2 {
  constructor() {
    events.pipe(tap((value) => console.log(`Service 2 ${value}`))).subscribe();
  }
}

new Service2();
events.next('a');
new Service1();
events.next('b');
