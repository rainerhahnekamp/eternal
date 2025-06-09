import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Holiday } from '../../model/holiday';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  // withDevtools('holidays'),
  withState({
    holidays: new Array<Holiday>(),
    favouriteIds: new Array<number>(),
    filter: { query: '', type: 0 },
  }),
  withMethods((store) => {
    const baseUrl = '/holiday';
    const httpClient = inject(HttpClient);

    return {
      async load() {
        const holidays = await lastValueFrom(
          httpClient.get<Holiday[]>(baseUrl),
        );

        patchState(store, { holidays });
      },
      search(query: string, type: number) {
        patchState(store, { filter: { query, type } });
      },
      addFavourite(id: number) {
        patchState(store, {
          favouriteIds: [...store.favouriteIds(), id],
        });
      },
      removeFavourite(id: number) {
        patchState(store, {
          favouriteIds: store
            .favouriteIds()
            .filter((favouriteId) => favouriteId !== id),
        });
      },
    };
  }),
  withComputed((state) => {
    const filteredHolidays = computed(() => {
      const { query, type } = state.filter();
      return state
        .holidays()
        .filter((holiday) => holiday.title.includes(query))
        .filter((holiday) => !type || holiday.typeId === type);
    });

    return {
      filteredHolidays,
      holidaysWithFavourite: computed(() =>
        filteredHolidays().map((holiday) => ({
          ...holiday,
          isFavourite: state.favouriteIds().includes(holiday.id),
        })),
      ),
    };
  }),
);
