import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  signalStoreFeature,
  type,
  withFeature,
  withState,
} from '@ngrx/signals';
import { withCollection } from '../../../../shared/signal-store-features/with-collection';
import { withFavourites } from '../../../../shared/signal-store-features/with-favourites';
import { withLastUpdated } from '../../../../shared/signal-store-features/with-last-updated';
import { withLocalStorage } from '../../../../shared/signal-store-features/with-local-storage';
import { withUser } from '../../../../shared/signal-store-features/with-user';
import { SignalStoreFeatureType } from '../../../../shared/util/signal-store-feature-type';
import { Holiday } from '../../model/holiday';
import { HolidaysStoreState } from './model';

export type HolidaysStoreBaseFeature = SignalStoreFeatureType<
  typeof withHolidaysStoreBase
>;

export function withHolidaysStoreBase() {
  return signalStoreFeature(
    withCollection('_holidays', type<Holiday>(), true),
    withState<HolidaysStoreState>({
      isLoaded: false,
      filter: { query: '', type: 0 },
    }),
    withDevtools('holidays'),
    withFavourites(),
    withLocalStorage('holidays', 'Holidays'),
    withUser(),
    withFeature(({ _holidays, filter, _favouriteIds }) =>
      withLastUpdated(() => ({ _holidays, filter, _favouriteIds })),
    ),
  );
}
