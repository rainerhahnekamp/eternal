import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addFavourite,
  removeFavourite,
  withFavourites,
} from '../../../../shared/signal-store-features/with-favourites';
import { withLastUpdated } from '../../../../shared/signal-store-features/with-last-updated';
import { withLocalStorage } from '../../../../shared/signal-store-features/with-local-storage';
import { withProfiler } from '../../../../shared/signal-store-features/with-profiler';
import { withUser } from '../../../../shared/signal-store-features/with-user';
import { skipSameValues } from '../../../../shared/util/skip-same-values';
import { Holiday } from '../../model/holiday';
import { HolidayFilter } from '../model/model';
import { HolidayClient } from './holiday-client';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withState({
    _holidays: new Array<Holiday>(),
    isLoaded: false,
    filter: { query: '', type: 0 } as HolidayFilter,
  }),
  withDevtools('holidays'),
  withFavourites(),
  withLocalStorage('holidays', 'Holidays'),
  withUser(),
  withFeature(({ _holidays, filter, _favouriteIds }) =>
    withLastUpdated(() => ({ _holidays, filter, _favouriteIds })),
  ),
  withMethods((store, holidayClient = inject(HolidayClient)) => ({
    async _load() {
      const _holidays = await holidayClient.getHolidays();

      patchState(store, { _holidays, isLoaded: true });
    },
    search(query: string, type: number) {
      patchState(store, skipSameValues({ filter: { query, type } }));
    },
    addFavourite(id: number) {
      holidayClient.addFavourite(id);
      patchState(store, addFavourite(id));
    },
    removeFavourite(id: number) {
      holidayClient.removeFavourite(id);
      patchState(store, removeFavourite(id));
    },
  })),
  withComputed((state) => ({
    username: () => `${state.user.firstname()} ${state.user.lastname()}`,
    holidays: () => {
      const { query, type } = state.filter();
      return state
        ._holidays()
        .filter((holiday) => holiday.title.includes(query))
        .filter((holiday) => !type || holiday.typeId === type)
        .map((holiday) => ({
          ...holiday,
          isFavourite: state._favouriteIds().includes(holiday.id),
        }));
    },
  })),
  withProfiler(),
  withHooks((store) => ({
    onInit() {
      store.setUser('Rainer Hahnekamp');
      if (!store.isLoaded()) {
        store._load();
      }
    },
  })),
);
