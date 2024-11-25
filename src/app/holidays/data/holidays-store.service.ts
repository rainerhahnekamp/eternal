import { computed, inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromHolidays } from './holidays.selectors';
import { Holiday } from '../model';
import { holidaysActions } from './holidays.actions';

@Injectable({ providedIn: 'root' })
export class HolidaysStore {
  readonly #store = inject(Store);

  get holidaysWithFavourite(): Signal<(Holiday & { isFavourite: boolean })[]> {
    return this.#store.selectSignal(fromHolidays.selectHolidaysWithFavourite);
  }

  get holidays(): Signal<Holiday[]> {
    const holidaysSignal = this.#store.selectSignal(fromHolidays.get);
    return computed(() => structuredClone(holidaysSignal()));
  }

  get() {
    this.#store.dispatch(holidaysActions.get());
  }

  addFavourite(id: number) {
    this.#store.dispatch(holidaysActions.addFavourite({ id }));
  }

  removeFavourite(id: number) {
    this.#store.dispatch(holidaysActions.removeFavourite({ id }));
  }
}
