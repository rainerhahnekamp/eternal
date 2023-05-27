import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromHolidays } from './holidays.selectors';
import { filter } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { Observable } from 'rxjs';
import { Holiday } from '../model';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #store = inject(Store);

  get holidays$(): Observable<Holiday[]> {
    return this.#store.select(fromHolidays.holidays);
  }

  get selected$(): Observable<Holiday> {
    return this.#store.select(fromHolidays.selected).pipe(filter(Boolean));
  }

  select = (id: number) => this.#store.dispatch(holidaysActions.select({ id }));

  unselect = () => this.#store.dispatch(holidaysActions.unselect());
}
