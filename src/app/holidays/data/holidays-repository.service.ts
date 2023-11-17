import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '@app/holidays/data/holidays.actions';
import { fromHolidays } from '@app/holidays/data/holidays.selectors';
import { Holiday } from '@app/holidays/model';
import { Observable } from 'rxjs';
import { deepClone } from '@app/shared/ngrx-utils';

function clonedSignal<T>(signal: Signal<T>): Signal<T> {
  return computed(() => {
    const value = signal();
    return structuredClone(value);
  });
}

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #store = inject(Store);

  get holidays(): Signal<Holiday[]> {
    return clonedSignal(this.#store.selectSignal(fromHolidays.get));
  }

  get holidays$(): Observable<Holiday[]> {
    return this.#store.select(fromHolidays.get).pipe(deepClone);
  }

  get isLoaded(): Signal<boolean> {
    return this.#store.selectSignal(fromHolidays.selectIsLoaded);
  }

  person = signal({ id: 1, name: 'Konrad' });

  get holidaysWithFavourites() {
    return this.#store.selectSignal(fromHolidays.selectHolidaysWithFavourite);
  }

  load() {
    this.#store.dispatch(holidaysActions.get());
  }

  addFavourite(id: number) {
    this.#store.dispatch(holidaysActions.addFavourite({ id }));
  }
  removeFavourite(id: number) {
    this.#store.dispatch(holidaysActions.removeFavourite({ id }));
  }
}
