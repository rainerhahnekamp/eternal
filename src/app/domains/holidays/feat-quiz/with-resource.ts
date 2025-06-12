import { Resource, ResourceRef } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

export function withResource<T>(resource: ResourceRef<T>) {
  function hasValue(): this is Resource<Exclude<T, undefined>> {
    return resource.hasValue();
  }

  return signalStoreFeature(
    withState({
      value: resource.value,
    }),
    withProps(() => ({
      status: resource.status,
      error: resource.error,
      isLoading: resource.isLoading,
    })),
    withMethods(() => ({
      hasValue: hasValue,
      _reload: () => resource.reload(),
    })),
  );
}
