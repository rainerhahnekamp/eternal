import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export function withSelectedId() {
  return signalStoreFeature(
    withState({ _selectedId: undefined as undefined | number }),
    withMethods((store) => ({
      select(id: number) {
        patchState(store, { _selectedId: id });
      },
      unselect() {
        patchState(store, { _selectedId: undefined });
      },
    })),
  );
}
