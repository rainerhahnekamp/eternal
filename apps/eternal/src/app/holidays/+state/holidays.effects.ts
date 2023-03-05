import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { Holiday } from '../model/holiday';
import { Configuration } from '../../shared/configuration';

@Injectable()
export class HolidaysEffects implements OnInitEffects {
  #actions$ = inject(Actions);
  #httpClient = inject(HttpClient);
  #baseUrl = inject(Configuration).baseUrl;

  load$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(holidaysActions.load),
      switchMap(() => this.#httpClient.get<Holiday[]>(`/holiday`)),
      map((holidays) =>
        holidays.map((holiday) => ({
          ...holiday,
          imageUrl: `${this.#baseUrl}${holiday.imageUrl}`
        }))
      ),
      map((holidays) => holidaysActions.loadSuccess({ holidays }))
    )
  );

  ngrxOnInitEffects = () => holidaysActions.load();
}
