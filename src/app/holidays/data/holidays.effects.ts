import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { Holiday } from '../model';
import { Store } from '@ngrx/store';
import { holidaysFeature } from './holidays.reducer';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { noopAction } from '../../shared/ngrx-utils';

@Injectable()
export class HolidaysEffects {
  #actions$ = inject(Actions);
  #httpClient = inject(HttpClient);
  #baseUrl = '/holiday';
  #store = inject(Store);

  get$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.get),
      concatLatestFrom(() =>
        this.#store.select(holidaysFeature.selectLoadStatus),
      ),
      // filter(([, loadStatus]) => loadStatus === 'not loaded'),
      map(() => holidaysActions.load()),
    );
  });

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.load),
      tap(() => console.log('processing load action')),
      switchMap(() =>
        this.#httpClient.get<Holiday[]>(this.#baseUrl).pipe(
          mapResponse({
            next: (holidays) => holidaysActions.loaded({ holidays }),
            error: (err) => {
              console.error(err);
              return noopAction();
            },
          }),
        ),
      ),
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
