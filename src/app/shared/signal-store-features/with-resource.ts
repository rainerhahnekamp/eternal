import { ResourceRef } from '@angular/core';
import {
  signalStoreFeature,
  withComputed,
  withFeature,
  withLinkedState,
  withMethods,
} from '@ngrx/signals';
import { withFavourites } from './with-favourites';

export function withResource<T>(resourceFactory: () => ResourceRef<T>) {
  const res = resourceFactory();
  return signalStoreFeature(
    withLinkedState((store) => ({
      value: res.value,
    })),
    withComputed((store) => ({
      status: () => res.status(),
      error: () => res.error(),
    })),
    withMethods((store) => ({
      hasValue: () => res.hasValue(),
      isLoading: () => res.isLoading(),
    })),
  );
}
