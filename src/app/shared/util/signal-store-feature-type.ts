import { EmptyFeatureResult, SignalStoreFeature } from '@ngrx/signals';

export type SignalStoreFeatureType<
  Feature extends (...args: never[]) => SignalStoreFeature,
> = Feature extends (
  ...args: never[]
) => SignalStoreFeature<EmptyFeatureResult, infer Output>
  ? Output
  : never;
