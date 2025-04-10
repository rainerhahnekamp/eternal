import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Holiday, parseHolidays } from '../model/holiday';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

export type HolidayWithFavourite = Holiday & {
  isFavourite: boolean;
};

export interface HolidayState {
  _favouriteIds: number[];
}

const initialState: HolidayState = {
  _favouriteIds: [],
};

export const HolidayStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => {
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    return {
      _resource: httpResource(
        () => {
          if (isServer) {
            return undefined;
          }
          return '/holiday';
        },
        {
          defaultValue: [],
          parse: parseHolidays,
        },
      ),
    };
  }),
  withComputed((state) => ({
    holidays: computed(() => {
      return state._resource.value().map((holiday) => ({
        ...holiday,
        isFavourite: state._favouriteIds().includes(holiday.id),
      }));
    }),
  })),
  withMethods((store) => ({
    addFavourite(id: number) {
      patchState(store, ({ _favouriteIds }) => ({
        _favouriteIds: [..._favouriteIds, id],
      }));
    },
    removeFavourite(id: number) {
      patchState(store, ({ _favouriteIds }) => ({
        _favouriteIds: _favouriteIds.filter((i) => i !== id),
      }));
    },
  })),
);
