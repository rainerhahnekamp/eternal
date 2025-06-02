import { computed, inject, Injectable, signal } from '@angular/core';
import { Holiday } from '../model/holiday';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Events, withEffects, withReducer, on } from '@ngrx/signals/events';
import { holidayEvents } from './holiday-events';

@Injectable({ providedIn: 'root' })
export class BasicHolidayStore {
  #state = signal({
    holidays: [] as Holiday[],
    status: 'not loaded' as 'not loaded' | 'loaded' | 'error',
    searchParams: {
      query: '',
      type: '',
    },
    lastUpdated: new Date(),
  });

  holidays = computed(() => this.#state().holidays);
  searchParams = computed(() => this.#state().searchParams);
  status = computed(() => this.#state().status);
  lastUpdated = computed(() => this.#state().lastUpdated);
  query = computed(() => this.searchParams().query);

  // Methods

  httpClient = inject(HttpClient);
  load() {
    this.httpClient.get<Holiday[]>('/holiday').subscribe((holidays) => {
      this.#state.update((value) => ({ ...value, holidays }));
    });
  }
}

function withLocalStorageSync() {
  return signalStoreFeature(
    withState({
      hasSynced: false,
    }),
    withMethods((store) => ({
      syncToLocalStore() {},
      syncFromLocalStore() {},
    })),
  );
}

export const HolidaySignalStore = signalStore(
  { providedIn: 'root' },
  withLocalStorageSync(),
  withState({
    holidays: [] as Holiday[],
    status: 'not loaded' as 'not loaded' | 'loaded' | 'error',
    searchParams: {
      query: '',
      type: '',
    },
    lastUpdated: new Date(),
  }),
  withEffects((store) => {
    const events = inject(Events);
    const httpClient = inject(HttpClient);

    return {
      load$: events.on(holidayEvents.load).pipe(
        debounceTime(500),
        filter(({ payload: { query } }) => Boolean(query)),
        switchMap(({ payload }) =>
          httpClient.get<Holiday[]>('/holiday', { params: payload }),
        ),
        map((holidays) => holidayEvents.loaded(holidays)),
      ),
    };
  }),
  withReducer(
    on(holidayEvents.loaded, ({ payload: holidays }) => ({ holidays })),
  ),
  withMethods((store) => {
    const httpClient = inject(HttpClient);

    return {
      load: rxMethod<{ query: string; type: string }>(
        pipe(
          debounceTime(500),
          filter(({ query }) => Boolean(query)),
          switchMap((query) =>
            httpClient.get<Holiday[]>('/holiday', { params: query }),
          ),
          tap((holidays) => patchState(store, { holidays })),
        ),
      ),
    };
  }),
);
