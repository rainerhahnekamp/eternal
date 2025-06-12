import { signalStoreFeature, type, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Holiday } from '../holiday';
import { withFavourites } from '../../../../shared/ngrx-features/with-favourites';

interface HolidaysState {
  search: { query: string; type: string };
}

export interface HolidayDetail extends Holiday {
  lastUpdated: Date;
}

const initialState: HolidaysState = {
  search: {
    query: '',
    type: '0',
  },
};

export function withHolidaysState() {
  return signalStoreFeature(
    withState(initialState),
    withEntities<Holiday>(),
    withEntities({
      entity: type<HolidayDetail>(),
      collection: 'holidayDetail',
    }),
    withFavourites(),
  );
}
