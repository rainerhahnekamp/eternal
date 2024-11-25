import { inject, Injectable } from '@angular/core';
import { HolidaysStore } from '../data';

@Injectable({ providedIn: 'root' })
export class HolidaysApi {
  readonly #store = inject(HolidaysStore);

  get holidays() {
    return this.#store.holidays;
  }
}
