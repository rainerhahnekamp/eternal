import {
  EmptyFeatureResult,
  patchState,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  withState,
} from '@ngrx/signals';

export function withUser<
  Input extends SignalStoreFeatureResult,
>(): SignalStoreFeature<
  Input,
  EmptyFeatureResult & {
    state: { user: { firstname: string; lastname: string } };
    methods: { setUser: (name: string) => void };
  }
> {
  return (store) => {
    const updatedStore = withState({ user: { firstname: '', lastname: '' } })(
      store,
    );

    return {
      ...updatedStore,
      methods: {
        ...updatedStore.methods,
        setUser: (name: string) => {
          const [firstname, lastname] = name.split(' ');
          patchState(updatedStore, { user: { firstname, lastname } });
        },
      },
    };
  };
}
