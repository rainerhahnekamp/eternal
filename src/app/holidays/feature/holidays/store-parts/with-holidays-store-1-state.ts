import { signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Holiday } from '../../../model';
import { withFavourites } from '../with-favourites';
import { inject } from '@angular/core';
import { HolidaysService } from '../holidays.service';

export type HolidaysWithFavourite = Holiday & { isFavourite: boolean };

interface HolidaysState {
  _favouriteIds: number[];
  _status: 'initialized' | 'loading' | 'loaded';
  _searchParams: {
    name: string;
    description: string;
  };
  _selectedHolidayId: number;
}

export function withHolidaysStoreState() {
  return signalStoreFeature(
    withEntities<Holiday>(),
    withState<HolidaysState>({
      _favouriteIds: [],
      _status: 'initialized',
      _searchParams: { name: '', description: '' },
      _selectedHolidayId: 0,
    }),
    withFavourites(),
    withProps(() => {
      const holidaysService = inject(HolidaysService);
      return { _holidaysService: holidaysService };
    }),
  );
}
