import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Holiday } from '@eternal/holidays/model';
import { Configuration } from '@eternal/shared/config';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, map, switchMap } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { holidaysFeature } from './holidays.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class HolidaysEffects {
  #actions$ = inject(Actions);
  #httpClient = inject(HttpClient);
  #config = inject(Configuration);
  #store = inject(Store);

  #baseUrl = '/holiday';

  get$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.get),
      concatLatestFrom(() =>
        this.#store.select(holidaysFeature.selectLoadStatus)
      ),
      filter(([, loadStatus]) => loadStatus === 'not loaded'),
      map(() => holidaysActions.load())
    );
  });

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.load),
      switchMap(() => this.#httpClient.get<Holiday[]>(this.#baseUrl)),
      map((holidays) =>
        holidays.map((holiday) => ({
          ...holiday,
          imageUrl: `${this.#config.baseUrl}${holiday.imageUrl}`,
        }))
      ),
      map((holidays) => holidaysActions.loaded({ holidays }))
    );
  });

  addFavourite$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.addFavourite),
      concatMap(({ id }) =>
        this.#httpClient
          .post<void>(`${this.#baseUrl}/favourite/${id}`, {})
          .pipe(map(() => holidaysActions.favouriteAdded({ id })))
      )
    );
  });

  removeFavourite$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.removeFavourite),
      concatMap(({ id }) =>
        this.#httpClient
          .delete(`${this.#baseUrl}/favourite/${id}`)
          .pipe(map(() => holidaysActions.favouriteRemoved({ id })))
      )
    );
  });
}
