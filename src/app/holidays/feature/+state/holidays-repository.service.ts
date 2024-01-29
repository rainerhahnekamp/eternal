import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromHolidays } from './holidays.selectors';
import { Holiday } from '../../model';
import { holidaysActions } from '@app/holidays/feature/+state/holidays.actions';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #store = inject(Store);

  get holidays(): Signal<Holiday[]> {
    return this.#store.selectSignal(fromHolidays.get);
  }

  get selected() {
    return this.#store.selectSignal(fromHolidays.selectSelected);
  }

  select(id: number) {
    this.#store.dispatch(holidaysActions.select({ id }));
  }
}
