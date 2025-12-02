import {
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withState,
} from '@ngrx/signals';
import { Holiday } from '../../domains/holidays/feat-overview/holiday';

type ModelComputed<Model extends { id: number }, Name extends string> = {
  [Key in Name]: () => Model[];
};

type ModelState<Model extends { id: number }, Name extends string> = {
  [Key in Name as `${Name}Map`]: Record<number, Model>;
} & {
  [Key in Name as `${Name}Ids`]: number[];
};

export function withModels<Model extends { id: number }, Name extends string>(
  model: Model,
  name: Name,
) {
  return signalStoreFeature(
    withState({
      [name + 'Map']: {},
      [name + 'Ids']: [],
    } as ModelState<Model, Name>),
    withComputed(() => {
      return {
        [name]: () => [] as Model[],
      } as ModelComputed<Model, Name>;
    }),
  );
}

const HolidaysStore = signalStore(withModels(type<Holiday>(), 'holidays'));
const store = new HolidaysStore();
