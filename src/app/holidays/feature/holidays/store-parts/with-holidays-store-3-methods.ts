import {
  patchState,
  signalMethod,
  signalStoreFeature,
  withMethods,
} from '@ngrx/signals';
import { withHolidaysStoreComputed } from './with-holidays-store-2-computed';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, of, pipe, tap } from 'rxjs';
import { setAllEntities } from '@ngrx/signals/entities';

export function withHolidaysStoreFinal() {
  return signalStoreFeature(
    withHolidaysStoreComputed(),
    withMethods((store) => {
      const { _holidaysService } = store;
      return {
        search: rxMethod<{ name: string; description: string }>(
          pipe(
            concatMap(({ name, description }) => {
              const status = store._status();
              if (status === 'initialized') {
                patchState(store, { _status: 'loading' });
                return _holidaysService.find().pipe(
                  tap((holidays) => {
                    patchState(store, {
                      _searchParams: { name, description },
                      _status: 'loaded',
                    });
                    patchState(store, setAllEntities(holidays));
                  }),
                );
              } else {
                patchState(store, { _searchParams: { name, description } });
                return of();
              }
            }),
          ),
        ),

        setSelectedHoliday: signalMethod<number>((id) =>
          patchState(store, { _selectedHolidayId: id }),
        ),
      };
    }),
  );
}
