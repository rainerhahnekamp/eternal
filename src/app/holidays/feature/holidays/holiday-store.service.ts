import { computed, inject } from '@angular/core';
import { Holiday } from '../../model';
import { HttpClient } from '@angular/common/http';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, lastValueFrom, pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { withFavourites } from './with-favourites';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

interface HolidayState {
  _holidays: Holiday[];
  searchParams: {
    name: string;
    description: string;
  };
  isLoaded: boolean;
}

const initialState: HolidayState = {
  _holidays: [],
  searchParams: {
    name: '',
    description: '',
  },
  isLoaded: false,
};

export const HolidayStore = signalStore(
  { providedIn: 'root' },
  withDevtools('holidays'),
  withProps(() => {
    const httpClient = inject(HttpClient);
    return {
      httpClient,
      url: 'https://api.eternal-holidays.net/holiday',
    };
  }),
  withFavourites(),
  withState(initialState),
  withComputed((state) => {
    return {
      holidays: computed(() => {
        const { _holidays, favouriteIds, searchParams } = state;
        const { name, description } = searchParams;
        return _holidays()
          .filter((holiday) => {
            return (
              holiday.title.startsWith(name()) &&
              holiday.description.startsWith(description())
            );
          })
          .map((holiday) => ({
            ...holiday,
            isFavourite: favouriteIds().includes(holiday.id),
          }));
      }),
      hasLoaded: computed(() => state.isLoaded()),
    };
  }),
  withMethods((store) => {
    return {
      search1: signalMethod<{ name: string; description: string }>(
        async (searchParams) => {
          patchState(store, { searchParams });
          const holidays = await lastValueFrom(
            store.httpClient.get<Holiday[]>(store.url, {
              params: searchParams,
            }),
          );
          patchState(store, { _holidays: holidays });
        },
      ),
      search: rxMethod<{ name: string; description: string }>(
        pipe(
          debounceTime(500),
          tap((searchParams) => patchState(store, { searchParams })),
          switchMap((searchParams) =>
            store.httpClient.get<Holiday[]>(store.url, {
              params: searchParams,
            }),
          ),
          tap((_holidays) => {
            patchState(store, {
              _holidays,
            });
          }),
        ),
      ),

      _refresh() {
        store.httpClient.get<Holiday[]>(store.url).subscribe((_holidays) => {
          patchState(store, {
            _holidays,
            isLoaded: true,
          });
        });
      },
    };
  }),
);
