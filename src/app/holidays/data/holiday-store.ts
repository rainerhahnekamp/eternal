import { Holiday } from '@app/holidays/model';
import { LoadStatus } from '@app/shared/ngrx-utils';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, mergeMap, pipe } from 'rxjs';
import { Configuration } from '@app/shared/config';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, tap } from 'rxjs/operators';

export type HolidaysState = {
  holidays: Holiday[];
  favouriteIds: number[];
  loadStatus: LoadStatus;
};

const initialState: HolidaysState = {
  holidays: [],
  favouriteIds: [],
  loadStatus: 'not loaded',
};

const baseUrl = '/holiday';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((state) => {
    const httpClient = inject(HttpClient);
    return {
      addFavourite: rxMethod<number>(
        pipe(
          mergeMap((id) =>
            httpClient
              .post<void>(`${baseUrl}/favourite/${id}`, {})
              .pipe(map(() => id)),
          ),

          tap((id) =>
            patchState(state, (value) => ({
              ...value,
              favouriteIds: [...value.favouriteIds, id],
            })),
          ),
        ),
      ),
      async removeFavourite(id: number) {
        await lastValueFrom(
          httpClient.delete<void>(`${baseUrl}/favourite/${id}`),
        );

        patchState(state, (value) => ({
          ...value,
          favouriteIds: value.favouriteIds.filter((i) => i !== id),
        }));
      },
    };
  }),
  withComputed((state) => {
    return {
      holidaysWithFavourites: computed(() => {
        const holidays = state.holidays();
        const favouriteIds = state.favouriteIds();
        return holidays.map((holiday) => ({
          ...holiday,
          isFavourite: favouriteIds.includes(holiday.id),
        }));
      }),
    };
  }),
  withHooks({
    async onInit(store) {
      const httpClient = inject(HttpClient);
      const config = inject(Configuration);
      const holidays = await lastValueFrom(httpClient.get<Holiday[]>(baseUrl));
      for (const holiday of holidays) {
        if (!holiday.imageUrl.startsWith('https:')) {
          holiday.imageUrl = `${config.baseUrl}${holiday.imageUrl}`;
        }
      }
      patchState(store, { holidays });
    },
  }),
);
