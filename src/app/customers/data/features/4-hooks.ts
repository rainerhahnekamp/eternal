import { signalStoreFeature, withHooks } from '@ngrx/signals';
import { withFeatureComputed } from './3-computed';

export function withFeatureHooks() {
  return signalStoreFeature(
    withFeatureComputed(),
    withHooks((store) => ({
      onInit() {
        store.load(0);
      },
    })),
  );
}
