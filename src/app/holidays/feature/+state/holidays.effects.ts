import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { Configuration } from '@app/shared/config';
import { Holiday } from '@app/holidays/model';

@Injectable()
export class HolidaysEffects {
  #actions$ = inject(Actions);
  #httpClient = inject(HttpClient);
  #config = inject(Configuration);
  #baseUrl = '/holiday';

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.load),
      switchMap(() => this.#httpClient.get<Holiday[]>(this.#baseUrl)),
      map((holidays) => holidaysActions.loaded({ holidays })),
    );
  });

  addFavourite$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.addFavourite),
      concatMap(({ id }) =>
        this.#httpClient
          .post<void>(`${this.#baseUrl}/favourite/${id}`, {})
          .pipe(map(() => holidaysActions.favouriteAdded({ id }))),
      ),
    );
  });

  removeFavourite$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.removeFavourite),
      concatMap(({ id }) =>
        this.#httpClient
          .delete(`${this.#baseUrl}/favourite/${id}`)
          .pipe(map(() => holidaysActions.favouriteRemoved({ id }))),
      ),
    );
  });
}
