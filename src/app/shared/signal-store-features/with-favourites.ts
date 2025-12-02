import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ResourceStatus, Signal } from '@angular/core';

export function addFavourite<IdType>(id: IdType) {
  return (state: { favouriteIds: IdType[] }) => ({
    favouriteIds: [...state.favouriteIds, id],
  });
}

export function removeFavourites(id: number) {
  return (state: { favouriteIds: number[] }) => ({
    favouriteIds: state.favouriteIds.filter(
      (favouriteId) => favouriteId !== id,
    ),
  });
}
export function removeAllFavourites() {
  return { favouriteIds: [] as number[] };
}

export interface FavouriteState {
  favouriteIds: number[];
}

export function withFavourites<IdType>(status: Signal<ResourceStatus>) {
  return signalStoreFeature(
    withState({ favouriteIds: [] as IdType[] }),
    withComputed((state) => ({
      hasFavourites: () => {
        if (status() === 'resolved') {
          return state.favouriteIds().length > 0;
        }

        return false;
      },
    })),
  );
}
