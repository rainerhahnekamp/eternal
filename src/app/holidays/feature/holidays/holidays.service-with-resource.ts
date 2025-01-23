import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '../../model';
import { map } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

export type HolidayWithFavourite = Holiday & { isFavourite: boolean };

@Injectable({ providedIn: 'root' })
export class HolidaysServiceWithResource {
  readonly #httpClient = inject(HttpClient);
  readonly #url = '/holiday';

  readonly #name = signal('');
  readonly #description = signal('');

  search(name: string, description: string) {
    this.#name.set(name);
    this.#description.set(description);
  }

  #holidaysResource = rxResource({
    request: () => {
      // = trigger
      return { name: this.#name(), description: this.#description() };
    },
    loader: ({ request }) => {
      console.log('requesting...');
      const { name, description } = request;
      return this.#httpClient.get<Holiday[]>(this.#url).pipe(
        map((holidays) => {
          return holidays
            .filter(
              (holiday) =>
                holiday.title.startsWith(name) &&
                holiday.description.startsWith(description),
            )
            .map((holiday) => ({ ...holiday, isFavourite: false }));
        }),
      );
    },
  });

  holidays = computed(() => this.#holidaysResource.value() || []);
}
