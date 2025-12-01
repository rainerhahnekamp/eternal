import { Resource, ResourceRef } from '@angular/core';
import {
  signalStoreFeature,
  withLinkedState,
  withMethods,
  withProps,
} from '@ngrx/signals';

export function withResource<T>(resource: ResourceRef<T>) {
  function hasValue(): this is Resource<Exclude<T, undefined>> {
    return resource.hasValue();
  }

  return signalStoreFeature(
    withLinkedState(() => ({
      value: resource.value,
    })),
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
