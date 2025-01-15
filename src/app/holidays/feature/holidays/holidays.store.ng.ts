import { Injectable } from '@angular/core';
import { patchState, signalState, signalStore, withHooks } from '@ngrx/signals';
import { withHolidaysStoreFinal } from './store-parts/with-holidays-store-3-methods';

/**
 * Vorteile
 *
 * 1. Standardisierung
 * 2. State ist schreibgeschützt nach aussen
 * 3. patch-Funktion des Signals, keine unnötigen Klone
 */
export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withHolidaysStoreFinal(),
  withHooks((store) => {
    return {
      onInit() {
        const { name, description } = store._searchParams;
        store.search({ name: name(), description: description() });
      },
    };
  }),
);

@Injectable({
  providedIn: 'root',
})
export class HolidayStore2 {
  readonly #state = signalState({
    holidays: [],
    favouriteIds: [] as number[],
    status: 'initialized',
    searchParams: { name: '', description: '' },
  });

  addFavourite(id: number) {
    if (this.#state.favouriteIds().includes(id)) {
      return;
    }

    patchState(this.#state, {
      favouriteIds: [...this.#state.favouriteIds(), id],
    });
  }
}
