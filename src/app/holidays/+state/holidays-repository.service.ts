import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromHolidays } from './holidays.selectors';
import { holidaysActions } from './holidays.actions';
import { Holiday } from '../model';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #store = inject(Store);

  get holidays(): Signal<Holiday[]> {
    return this.#store.selectSignal(fromHolidays.holidays);
  }

  get selected(): Signal<Holiday | undefined> {
    return this.#store.selectSignal(fromHolidays.selected);
  }

  select = (id: number) => this.#store.dispatch(holidaysActions.select({ id }));

  unselect = () => this.#store.dispatch(holidaysActions.unselect());
}
