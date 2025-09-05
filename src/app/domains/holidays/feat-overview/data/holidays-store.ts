import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { Holiday } from '../../model/holiday';
import { HolidayClient } from './holiday-client';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withDevtools('holidays'),
  withState({
    holidays: new Array<Holiday>(),
    favouriteIds: new Array<number>(),
    filter: { query: '', type: 0 },
  }),
  withMethods((store, holidayClient = inject(HolidayClient)) => ({
    async load() {
      const holidays = await holidayClient.getHolidays();

      patchState(store, { holidays });
    },
    async addFavourite(id: number) {
      await holidayClient.addFavourite(id);
      patchState(store, {
        favouriteIds: [...store.favouriteIds(), id],
      });
    },
    async removeFavourite(id: number) {
      await holidayClient.removeFavourite(id);
      patchState(store, {
        favouriteIds: store
          .favouriteIds()
          .filter((favouriteId) => favouriteId !== id),
      });
    },
    search(query: string, type: number) {
      patchState(store, { filter: { query, type } });
    },
  })),
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
