import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { withHolidaysStoreState } from './with-holidays-store-1-state';
import { computed } from '@angular/core';

export function withHolidaysStoreComputed() {
  return signalStoreFeature(
    withHolidaysStoreState(),
    withComputed((state) => ({ _holidays: computed(() => state.entities()) })),
    withComputed((state) => {
      const holidaysWithFavourite = computed(() => {
        const holidays = state._holidays();
        const favouriteIds = state._favouriteIds();
        const { name, description } = state._searchParams();

        return holidays
          .filter(
            (holiday) =>
              holiday.title.startsWith(name) &&
              holiday.description.startsWith(description),
          )
          .map((holiday) => ({
            ...holiday,
            isFavourite: favouriteIds.includes(holiday.id),
          }));
      });

      return {
        prettySearch: computed(
          () => `Anzahl gefundene Holidays: ${holidaysWithFavourite().length}`,
        ),
        holidaysWithFavourite,
      };
    }),
  );
}
