import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Holiday } from '../holiday';
import { holidaysActions } from './holidays.actions';

@Injectable()
export class HolidaysEffects {
  find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(holidaysActions.findHolidays),
      switchMap(() =>
        this.httpClient.get<{ holidays: Holiday[] }>(
          'https://eternal-app.s3.eu-central-1.amazonaws.com/holidays.json'
        )
      ),
      map(({ holidays }) => holidaysActions.findHolidaysSuccess({ holidays }))
    )
  );

  constructor(private actions$: Actions, private httpClient: HttpClient) {}
}
