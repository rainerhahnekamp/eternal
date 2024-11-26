import { signalStoreFeature } from '@ngrx/signals';
import { withSelectedId } from '../../../shared/ngrx-utils/with-selected-id';

export function withFeatureSelected() {
  return signalStoreFeature(withSelectedId());
}
