import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from './holiday';

@Injectable({ providedIn: 'root' })
export class HolidaysStore {
  readonly #httpClient = inject(HttpClient);
  readonly holidays = signal<Holiday[]>([]);

  load() {
    this.#httpClient
      .get<Holiday[]>('/holiday')
      .subscribe((holidays) => this.holidays.set(holidays));
  }
}
