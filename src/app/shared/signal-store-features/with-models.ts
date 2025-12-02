import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { Holiday } from '../../domains/holidays/feat-overview/holiday';
import { Provider } from '@angular/core';

export function withModels<Type extends { id: number }, Name extends string>(
  type: Type,
  name: Name,
) {
  const state = {
    [name + 'Map']: {},
  } as {
    [Key in Name as `${Key}Map`]: Record<number, Type>;
  };

  return signalStoreFeature(withState(state));
}
