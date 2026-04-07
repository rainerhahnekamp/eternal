import { signalStoreFeature, withState } from '@ngrx/signals';

export function withCollection<Collection, Name extends string>(
  name: Name,
  type: Collection,
) {
  return signalStoreFeature(
    withState({ [name]: [] as Collection[] } as Record<Name, Collection[]>),
  );
}
