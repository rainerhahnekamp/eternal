import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

type CollectionMethods<
  Collection,
  Name extends string,
  AddSetter extends boolean,
> = AddSetter extends true
  ? Record<`set${Capitalize<Name>}`, (collection: Collection[]) => void>
  : {};

export function withCollection<
  Collection,
  Name extends string,
  AddSetter extends boolean,
>(name: Name, type: Collection, addSetter: AddSetter) {
  return signalStoreFeature(
    withState({ [name]: [] as Collection[] } as Record<Name, Collection[]>),
    withMethods((store) => {
      if (addSetter === false) {
        return {} as CollectionMethods<Collection, Name, AddSetter>;
      }
      return {
        [`set${capitalize(name)}`]: (collection: Collection[]) =>
          patchState(store, { [name]: collection } as Partial<
            Record<Name, Collection[]>
          >),
      } as CollectionMethods<Collection, Name, AddSetter>;
    }),
  );
}

function capitalize(value: string) {
  return value[0] + value.slice(1);
}
