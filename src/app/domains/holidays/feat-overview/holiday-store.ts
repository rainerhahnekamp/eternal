import { inject, ResourceStatus } from '@angular/core';
import { Holiday } from './holiday';
import { HttpClient } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
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

export const HolidayStore = signalStore(
  { providedIn: 'root' },
  withEntities<Holiday>(),
  withState({
    search: {
      query: '',
      type: 0,
    },
    resourceStatus: 'resolved' as ResourceStatus,
  }),
  withFeature((store) => withFavourites<number>(store.resourceStatus)),
  withComputed(({ entities, favouriteIds, search: { type, query } }) => ({
    holidays: () =>
      entities()
        .map((holiday) => ({
          ...holiday,
          isFavourite: favouriteIds().includes(holiday.id),
        }))
        .filter(
          (holiday) =>
            holiday.title.toLowerCase().startsWith(query().toLowerCase()) &&
            (type() === 0 || holiday.typeId === type()),
        ),
  })),

  withMethods(
    (store, httpClient = inject(HttpClient), baseUrl = '/holiday') => {
      return {
        load: () => {
          httpClient
            .get<Holiday[]>(baseUrl)
            .subscribe((holidays) =>
              patchState(store, setAllEntities(holidays)),
            );
        },

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
      };
    },
  ),
  withHooks((store) => ({
    onInit() {
      store.load();
    },
  })),
);
