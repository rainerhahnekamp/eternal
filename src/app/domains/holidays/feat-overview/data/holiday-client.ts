import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Holiday, parseHolidays } from '../../model/holiday';

@Injectable({ providedIn: 'root' })
export class HolidayClient {
  readonly #httpClient = inject(HttpClient);
  readonly #baseUrl = '/holiday';

  getHolidays() {
    return lastValueFrom(this.#httpClient.get<Holiday[]>(this.#baseUrl));
  }

  holidays() {
    return httpResource(
      () => ({
        url: this.#baseUrl,
      }),
      {
        parse: (value) => parseHolidays(value),
      },
    );
  }

  addFavourite(id: number) {
    return lastValueFrom(
      this.#httpClient.post(`${this.#baseUrl}/${id}/favourite`, {}),
    );
  }

  removeFavourite(id: number) {
    return lastValueFrom(
      this.#httpClient.delete(`${this.#baseUrl}/${id}/favourite`),
    );
  }
}
