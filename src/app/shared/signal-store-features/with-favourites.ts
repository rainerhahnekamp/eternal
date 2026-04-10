import { Injectable, Signal } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withState,
  WritableStateSource,
} from '@ngrx/signals';
import { SignalStoreFeatureType } from '../util/signal-store-feature-type';

const FAVOURITE_IDS = Symbol('FAVOURITE_IDS');

export function withFavourites() {
  return signalStoreFeature(
    withState({
      [FAVOURITE_IDS]: new Array<number>(),
    }),
  );
}

export function getFavouriteIds(store: { [FAVOURITE_IDS]: Signal<number[]> }) {
  return store[FAVOURITE_IDS];
}

interface FavouritesState {
  [FAVOURITE_IDS]: number[];
}

export type FavouritesFeature = SignalStoreFeatureType<typeof withFavourites>;

export function setFavourite(favouriteIds: number[]) {
  return { [FAVOURITE_IDS]: favouriteIds };
}

@Injectable({ providedIn: 'root' })
export class FavouriteService {
  addFavourite(
    store: WritableStateSource<{ [FAVOURITE_IDS]: number[] }>,
    id: number,
  ) {
    // ... before logic
    patchState(store, (state) => ({
      [FAVOURITE_IDS]: [...state[FAVOURITE_IDS], id],
    }));
    // ... after logic
  }
}

export function addFavourite(id: number) {
  return (state: FavouritesState) => ({
    [FAVOURITE_IDS]: [...state[FAVOURITE_IDS], id],
  });
}

export function removeFavourite(id: number) {
  return (state: FavouritesState) => ({
    [FAVOURITE_IDS]: state[FAVOURITE_IDS].filter(
      (favouriteId) => favouriteId !== id,
    ),
  });
}
