import { signalStoreFeature } from '@ngrx/signals';
import { withCrud } from '../../../shared/ngrx-utils/with-crud';
import { Customer } from '../../model';
import { withFeatureSelected } from './1-selected-id';

export function withFeatureCrud() {
  return signalStoreFeature(
    withFeatureSelected(),
    withCrud<Customer>('/customer', '/customer'),
  );
}
