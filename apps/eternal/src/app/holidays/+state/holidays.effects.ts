import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Holiday } from '../holiday';
import { holidaysActions } from './holidays.actions';
import { Configuration } from '../../shared/configuration';

export const findHolidays = createEffect(
  (
    actions$ = inject(Actions),
    httpClient = inject(HttpClient),
    baseUrl = inject(Configuration).baseUrl
  ) => {
    return actions$.pipe(
      ofType(holidaysActions.findHolidays),
      switchMap(() => httpClient.get<Holiday[]>('/holiday')),
      map((holidays) =>
        holidays.map((holiday) => ({
          ...holiday,
          imageUrl: `${baseUrl}${holiday.imageUrl}`
        }))
      ),
      map((holidays) => holidaysActions.findHolidaysSuccess({ holidays }))
    );
  },
  { functional: true }
);
