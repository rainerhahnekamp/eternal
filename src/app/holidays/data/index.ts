import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { Holiday } from '@app/holidays/model';
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { lastValueFrom, pipe } from 'rxjs';
import { Configuration } from '@app/shared/config';
import { concatMap, filter, tap } from 'rxjs/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const HolidayStore = signalStore(
  { providedIn: 'root' },
  withDevtools('holidays'),
  withState({
    holidays: new Array<Holiday>(),
    favouriteIds: new Array<number>(),
  }),
  withMethods((store) => {
    const baseUrl = '/holiday';
    const config = inject(Configuration);
    const httpClient = inject(HttpClient);

    return {
      async load() {
        const holidays = await lastValueFrom(
          httpClient.get<Holiday[]>(baseUrl),
        );

        patchState(store, {
          holidays: holidays.map((holiday) => ({
            ...holiday,
            imageUrl: holiday.imageUrl.startsWith('/assets')
              ? holiday.imageUrl
              : `${config.baseUrl}${holiday.imageUrl}`,
          })),
        });
      },
      addFavourite: rxMethod<number>(
        pipe(
          filter((id) => !store.favouriteIds().includes(id)),
          concatMap((id) =>
            httpClient.post<void>(`${baseUrl}/favourite/${id}`, {}).pipe(
              tap(() => {
                patchState(store, {
                  favouriteIds: [...store.favouriteIds(), id],
                });
              }),
            ),
          ),
        ),
      ),
      removeFavourite: rxMethod<number>(
        pipe(
          concatMap((id) =>
            httpClient.delete(`${baseUrl}/favourite/${id}`).pipe(
              tap(() =>
                patchState(store, {
                  favouriteIds: store
                    .favouriteIds()
                    .filter((favouriteId) => favouriteId !== id),
                }),
              ),
            ),
          ),
        ),
      ),
    };
  }),
  withComputed((state) => {
    return {
      holidaysWithFavourite: computed(() =>
        state.holidays().map((holiday) => ({
          ...holiday,
          isFavourite: state.favouriteIds().includes(holiday.id),
        })),
      ),
    };
  }),
);
