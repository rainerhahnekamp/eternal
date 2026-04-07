import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStoreFeature, withFeature, withState } from '@ngrx/signals';
import { withFavourites } from '../../../../../shared/signal-store-features/with-favourites';
import { withLastUpdated } from '../../../../../shared/signal-store-features/with-last-updated';
import { withLocalStorage } from '../../../../../shared/signal-store-features/with-local-storage';
import { withUser } from '../../../../../shared/signal-store-features/with-user';
import { SignalStoreFeatureType } from '../../../../../shared/util/signal-store-feature-type';
import { Holiday } from '../../../model/holiday';
import { HolidaysStoreState } from '../model';

export type HolidaysStoreBaseFeature = SignalStoreFeatureType<
  typeof withHolidaysStoreBase
>;

export function withHolidaysStoreBase() {
  return signalStoreFeature(
    withState<HolidaysStoreState & { _holidays: Holiday[] }>({
      _holidays: [],
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
