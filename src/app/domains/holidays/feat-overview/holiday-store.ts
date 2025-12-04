import { inject, ResourceStatus } from '@angular/core';
import { Holiday, toHolidays } from './holiday';
import { HttpClient, httpResource } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import {
  addFavourite,
  removeFavourites,
  withFavourites,
} from '../../../shared/signal-store-features/with-favourites';
import { withResource } from '../../../shared/signal-store-features/with-resource';

export const HolidayStore = signalStore(
  { providedIn: 'root' },
  withState({
    search: {
      query: '',
      type: 0,
    },
    resourceStatus: 'resolved' as ResourceStatus,
  }),
  withFeature((store) =>
    withResource(() =>
      httpResource(
        () => ({
          url: '/holiday',
          params: {
            query: store.search.query(),
          },
        }),
        {
          parse: toHolidays,
        },
      ),
    ),
  ),
  withFeature((store) => withFavourites<number>(store.resourceStatus)),
  withComputed(
    ({ value, hasValue, favouriteIds, search: { type, query } }) => ({
      holidays: () => {
        if (!hasValue()) {
          return [];
        }

        return (value() as Holiday[])
          .map((holiday) => ({
            ...holiday,
            isFavourite: favouriteIds().includes(holiday.id),
          }))
          .filter(
            (holiday) =>
              holiday.title.toLowerCase().startsWith(query().toLowerCase()) &&
              (type() === 0 || holiday.typeId === type()),
          );
      },
    }),
  ),

  withMethods(
    (store, httpClient = inject(HttpClient), baseUrl = '/holiday') => {
      return {
        handleSearch: rxMethod<{ query: string; type: number }>(
          pipe(
            debounceTime(500),
            tap((search) => patchState(store, { search })),
          ),
        ),
        addFavourite(id: number) {
          patchState(store, addFavourite(id));
        },
        removeFavourite(id: number) {
          patchState(store, removeFavourites(id));
        },
        emptyHolidays() {
          patchState(store, { value: [] });
        },
      };
    },
  ),
);
