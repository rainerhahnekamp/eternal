import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { withHolidaysStoreMethods } from './2-with-holdays-store-methods';

export function withHolidaysStoreComputed() {
  return signalStoreFeature(
    withHolidaysStoreMethods(),
    withComputed((state) => ({
      username: () => `${state.user.firstname()} ${state.user.lastname()}`,
      holidays: () => {
        const { query, type } = state.filter();
        return state
          ._holidays()
          .filter((holiday) => holiday.title.includes(query))
          .filter((holiday) => !type || holiday.typeId === type)
          .map((holiday) => ({
            ...holiday,
            isFavourite: state._favouriteIds().includes(holiday.id),
          }));
      },
    })),
  );
}
