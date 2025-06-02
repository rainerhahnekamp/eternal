import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Holiday, parseHolidays } from '../model/holiday';
import { rxResource } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HolidaysStore {
  readonly #httpClient = inject(HttpClient);
  readonly holidays = signal<Holiday[]>([]);

  load(searchParams: Signal<{ query: string; type: string }>) {
    return httpResource(
      () => {
        const { query, type } = searchParams();

        if (query === '') {
          return undefined;
        }

        return {
          url: '/holiday',
          params: { query, type },
        };
      },
      {
        defaultValue: [],
        parse: parseHolidays,
      },
    );
  }

  loadByRxResource(searchParams: Signal<{ query: string; type: string }>) {
    return rxResource({
      params: searchParams,
      defaultValue: [],
      stream: () => {
        const { query, type } = searchParams();
        return this.#httpClient.get<Holiday[]>('/holiday', {
          params: { query, type },
        });
      },
    });
  }

  loadByResource(searchParams: Signal<{ query: string; type: string }>) {
    return resource({
      params: searchParams,
      defaultValue: [],
      loader: (params) => {
        const { query, type } = searchParams();
        return lastValueFrom(
          this.#httpClient.get<Holiday[]>('/holiday', {
            params: { query, type },
          }),
        );
      },
    });
  }
}
