import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '../../model';
import { lastValueFrom, map, Observable } from 'rxjs';

export type HolidayWithFavourite = Holiday & { isFavourite: boolean };

@Injectable({ providedIn: 'root' })
export class HolidaysService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = '/holiday';

  find(name: string, description: string): Observable<HolidayWithFavourite[]> {
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
  }

  findByPromise(
    name: string,
    description: string,
  ): Promise<HolidayWithFavourite[]> {
    return lastValueFrom(this.find(name, description));
  }
}
