import { computed, inject } from '@angular/core';
import { Holiday } from '../../model';
import { HttpClient } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

interface HolidayState {
  _holidays: Holiday[];
  favouriteIds: number[];
  searchParams: {
    name: string;
    description: string;
  };
  isLoaded: boolean;
}

// https://tinyurl.com/25-ngrx-eso

const initialState: HolidayState = {
  _holidays: [],
  favouriteIds: [],
  searchParams: {
    name: '',
    description: '',
  },
  isLoaded: false,
};

export const HolidayStore = signalStore(
  withProps(() => {
    const httpClient = inject(HttpClient);
    return {
      httpClient,
      url: 'https://api.eternal-holidays.net/holiday',
    };
  }),
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
      search(name: string, description: string) {
        patchState(store, { searchParams: { name, description } });

        if (store.isLoaded()) {
          return;
        }

        store.httpClient.get<Holiday[]>(store.url).subscribe((holidays) => {
          patchState(store, {
            _holidays: holidays,
            isLoaded: true,
          });
        });
      },

      addFavourite(holidayId: number) {
        if (store.favouriteIds().includes(holidayId)) {
          return;
        }

        patchState(store, (value) => ({
          favouriteIds: [...value.favouriteIds, holidayId],
        }));
      },

      removeFavourite(holidayId: number) {
        patchState(store, (value) => ({
          favouriteIds: value.favouriteIds.filter((id) => id !== holidayId),
        }));
      },

      refresh() {
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
