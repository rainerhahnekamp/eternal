import {
  EmptyFeatureResult,
  signalStore,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from '@ngrx/signals';

export function withFooFeature<
  Input extends SignalStoreFeatureResult,
>(): SignalStoreFeature<
  Input,
  EmptyFeatureResult & { props: { foo: string } }
> {
  return (store) => {
    return {
      ...store,
      props: { ...store.props, foo: 'bar' },
    };
  };
}

const store = new (signalStore(withFooFeature()))();
store.foo;
