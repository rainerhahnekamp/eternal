import { computed, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { parseHolidays } from '../model/holiday';

@Injectable({ providedIn: 'root' })
export class HolidaysStore {
  readonly #holidaysResource = httpResource(() => '/holiday', {
    defaultValue: [],
    parse: parseHolidays,
  });

  readonly #favouriteIds = signal<number[]>([]);

  readonly holidays = computed(() => {
    if (!this.#holidaysResource.hasValue()) {
      return [];
    }

    const favouriteIds = this.#favouriteIds();
    return this.#holidaysResource.value().map((holiday) => ({
      ...holiday,
      isFavourite: favouriteIds.includes(holiday.id),
    }));
  });

  addFavourite(id: number) {
    this.#favouriteIds.update((ids) => [...ids, id]);
  }

  removeFavourite(id: number) {
    this.#favouriteIds.update((ids) => ids.filter((i) => i !== id));
  }
}
