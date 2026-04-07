import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import {
  addFavourite,
  removeFavourite,
} from '../../../../../shared/signal-store-features/with-favourites';
import { skipSameValues } from '../../../../../shared/util/skip-same-values';
import { HolidayClient } from '../holiday-client';
import { withHolidaysStoreBase } from './1-with-holidays-store-base';

export function withHolidaysStoreMethods() {
  return signalStoreFeature(
    withHolidaysStoreBase(),
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
  );
}
