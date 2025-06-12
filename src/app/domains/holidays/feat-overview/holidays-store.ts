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
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

/** Things to discuss
 * - Private fields except _
 * - Defining the type of the SignalStore explicitly
 * - Store Dependencies via Component Composition
 */

interface HolidaysState {
  holidays: Holiday[];
  favouriteIds: number[];
  search: { query: string; type: string };
}

const initialState: HolidaysState = {
  holidays: [],
  favouriteIds: [],
  search: {
    query: '',
    type: '0',
  },
};

const userSignal = signal(
  { firstname: 'John', lastname: 'Doe' },
  { equal: (user1, user2) => user1.lastname === user2.lastname },
);

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withState({ user: userSignal }),
  withMethods((store) => {
    const httpClient = inject(HttpClient);

    const resetFavourites = signalMethod<number>(() =>
      patchState(store, { favouriteIds: [] }),
    );

    return {
      resetFavourites,
      addFavourite(id: number): void {
        patchState(store, ({ favouriteIds }) => ({
          favouriteIds: [...favouriteIds, id],
        }));
      },

      removeFavourite(id: number): void {
        patchState(store, ({ favouriteIds }) => ({
          favouriteIds: favouriteIds.filter(
            (favouriteId) => favouriteId !== id,
          ),
        }));
      },

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
                  next: (holidays) => patchState(store, { holidays }),
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

export const injectHolidaysStore = storeInjector(
  HolidaysStore,
  'holidays',
  'favouriteIds',
  'user',
);

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
