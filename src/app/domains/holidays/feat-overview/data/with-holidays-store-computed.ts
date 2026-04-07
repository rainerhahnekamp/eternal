import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { HolidaysStoreBaseFeature } from './with-holidays-store-base';

export function withHolidaysStoreComputed() {
  return signalStoreFeature(
    type<HolidaysStoreBaseFeature>(),
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
