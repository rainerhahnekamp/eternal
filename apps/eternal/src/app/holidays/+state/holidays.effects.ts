import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Holiday } from '../holiday';
import { holidaysActions } from './holidays.actions';
import { Configuration } from '../../shared/configuration';

@Injectable()
export class HolidaysEffects {
  #actions$ = inject(Actions);
  #httpClient = inject(HttpClient);
  #baseUrl = inject(Configuration).baseUrl;

  find$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(holidaysActions.findHolidays),
      switchMap(() => this.#httpClient.get<Holiday[]>('/holiday')),
      map((holidays) =>
        holidays.map((holiday) => ({
          ...holiday,
          imageUrl: `${this.#baseUrl}${holiday.imageUrl}`
        }))
      ),
      map((holidays) => holidaysActions.findHolidaysSuccess({ holidays }))
    )
  );
}
