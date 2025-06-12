import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { Holiday } from './holiday';
import { HttpClient } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { setAllEntities } from '@ngrx/signals/entities';
import { withLocalStorageSync } from '../../../shared/ngrx-features/with-local-storage-sync';
import { HolidayDetail, withHolidaysState } from './store/with-holidays-state';

/** Things to discuss
 * - Private fields except _
 * - Defining the type of the SignalStore explicitly
 * - Store Dependencies via Component Composition
 */

const userSignal = signal(
  { firstname: 'John', lastname: 'Doe' },
  { equal: (user1, user2) => user1.lastname === user2.lastname },
);

let currentKey = 1;

const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withHolidaysState(),
  withComputed((state) => ({ holidays: state.entities })),
  withMethods((store) => ({
    getKey() {
      return ++currentKey;
    },
    getKeyForLocalStorage() {
      return 'holidays';
    },
  })),
  withFeature((store) => withLocalStorageSync(store.getKeyForLocalStorage())),
  withMethods((store) => {
    const httpClient = inject(HttpClient);

    return {
      _handleSearch(query: string, type: string): void {
        patchState(store, { search: { query, type } });
      },

      load: rxMethod<{ query: string; type: string }>(
        pipe(
          debounceTime(500),
          switchMap(({ query, type }) =>
            httpClient
              .get<Holiday[]>('/holiday', { params: { query, type } })
              .pipe(
                tapResponse({
                  error: console.error,
                  next: (holidays) => {
                    patchState(
                      store,
                      setAllEntities(holidays),
                      setAllEntities([] as HolidayDetail[], {
                        collection: 'holidayDetail',
                      }),
                    );
                    store.syncToStorage();
                  },
                }),
              ),
          ),
        ),
      ),
    };
  }),

  withComputed((state) => ({
    prettySearch: () => {
      console.log('prettySearch running...');
      const { query, type } = state.search();
      return `Search: "${query}" | Type: ${type === '0' ? 'All' : type === '1' ? 'City' : 'Country'}`;
    },
    filteredHolidays: () => {
      const holidays = state.holidays();
      const favouriteIds = state.favouriteIds();
      const { query, type } = state.search();

      return untracked(() => {
        return holidays
          .map((holiday) => ({
            ...holiday,
            isFavourite: favouriteIds.includes(holiday.id),
          }))
          .filter(
            (holiday) =>
              holiday.title.toLowerCase().startsWith(query.toLowerCase()) &&
              (type === '0' || holiday.typeId === Number(type)),
          );
      });
    },
  })),
);

function storeInjector<T, P extends keyof T>(
  Store: new () => T,
  ...keys: P[]
): () => Omit<T, P> {
  void keys;
  return () => inject(Store);
}

export function provideHolidayStore() {
  return HolidaysStore;
}

// export const injectHolidaysStore = storeInjector(HolidaysStore);
export const injectHolidaysStore = () => inject(HolidaysStore);

@Injectable({ providedIn: 'root' })
export class _HolidaysStore {
  // State
  readonly #holidays = signal<Holiday[]>([]);
  readonly #favouriteIds = signal<number[]>([]);
  readonly #search = signal({
    query: '',
    type: '0',
  });

  // Slices
  readonly holidays = this.#holidays.asReadonly();
  readonly favouriteIds = this.#favouriteIds.asReadonly();
  readonly search = this.#search.asReadonly();

  // Computed Signals
  prettySearch = computed(() => {
    console.log('prettySearch running...');
    const { query, type } = this.#search();
    return `Search: "${query}" | Type: ${type === '0' ? 'All' : type === '1' ? 'City' : 'Country'}`;
  });

  readonly filteredHolidays = computed(() => {
    const holidays = this.holidays();
    const favouriteIds = this.favouriteIds();
    const { query, type } = this.search();

    return untracked(() => {
      return holidays
        .map((holiday) => ({
          ...holiday,
          isFavourite: favouriteIds.includes(holiday.id),
        }))
        .filter(
          (holiday) =>
            holiday.title.toLowerCase().startsWith(query.toLowerCase()) &&
            (type === '0' || holiday.typeId === Number(type)),
        );
    });
  });

  // Methods
  addFavourite(id: number): void {
    this.#favouriteIds.update((favouriteIds) => [...favouriteIds, id]);
  }

  removeFavourite(id: number): void {
    this.#favouriteIds.update((favouriteIds) =>
      favouriteIds.filter((favouriteId) => favouriteId !== id),
    );
  }

  handleSearch(query: string, type: string): void {
    this.#search.set({
      query,
      type,
    });
  }

  readonly #httpClient = inject(HttpClient);

  #searchEffect = effect(
    () => {
      this.#search();

      this.#httpClient
        .get<Holiday[]>('/holiday')
        .subscribe((holidays) => this.#holidays.set(holidays));
    },
    { debugName: 'Load Holidays' },
  );
}
