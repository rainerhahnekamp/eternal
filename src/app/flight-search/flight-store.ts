import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Flight } from '@app/flights/flight';
import { addMinutes } from 'date-fns';
import {
  payload,
  withCallState,
  withDevtools,
  withRedux,
} from '@angular-architects/ngrx-toolkit';
import { computed, inject, ProviderToken } from '@angular/core';
import { FlightService } from '@app/flight-search/flight.service';
import { debounceTime, Observable, pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, tap } from 'rxjs/operators';

function withLoader<Entity>(
  Loader: ProviderToken<{
    find: (from: string, to: string) => Observable<Entity[]>;
  }>,
) {
  return signalStoreFeature(
    withState({ searchParams: { from: '', to: '' }, entities: [] as Entity[] }),
    withCallState(),
    withMethods((store) => {
      const loader = inject(Loader);
      return {
        search: rxMethod<{ from: string; to: string }>(
          pipe(
            filter((searchParams) =>
              Boolean(searchParams && searchParams.to && searchParams.from),
            ),
            tap((searchParams) => patchState(store, { searchParams })),
            debounceTime(500),
            switchMap((searchParams) =>
              loader.find(searchParams.from, searchParams.to),
            ),
            tap((entities) => patchState(store, { entities })),
          ),
        ),
      };
    }),
    withComputed((state) => ({
      prettySearch: computed(
        () => `${state.searchParams.from} - ${state.searchParams.to}`,
      ),
    })),
  );
}

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withDevtools('flights'),
  withLoader<Flight>(FlightService),
  withMethods((store) => {
    return {
      delay() {
        patchState(store, ({ entities }) => {
          const oldFlight = { ...entities[0] };
          const oldDate = new Date(oldFlight.date);
          const newDate = addMinutes(oldDate, 15);
          oldFlight.date = newDate.toISOString();

          return { entities: [oldFlight, ...entities.slice(1)] };
        });
      },
    };
  }),
  withComputed((state) => ({ flights: computed(() => state.entities()) })),
  withHooks((store) => {
    return {
      onInit() {
        store.search(store.searchParams());
      },
    };
  }),
);
