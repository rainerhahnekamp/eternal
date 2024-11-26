import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, map, switchMap } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { Holiday } from '@app/holidays/model';
import { holidaysFeature } from '@app/holidays/data/holidays.reducer';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class HolidaysEffects {
  #actions$ = inject(Actions);
  #httpClient = inject(HttpClient);
  #store = inject(Store);
  #baseUrl = '/holiday';

  get$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(holidaysActions.get),
      concatLatestFrom(() =>
        this.#store.select(holidaysFeature.selectLoadStatus),
      ),
      filter(([, loadStatus]) => loadStatus === 'not loaded'),
      map(() => holidaysActions.load()),
    );
  });

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
