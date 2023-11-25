import { computed, Injectable, Signal, signal } from '@angular/core';
import { Holiday } from '@app/admin/holidays/model';
import { dummyHolidays } from '@app/admin/holidays/data/dummy-holidays';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidays = signal<Holiday[]>(dummyHolidays);

  get holidays(): Signal<Holiday[]> {
    return this.#holidays.asReadonly();
  }

  findById(id: number): Signal<Holiday | undefined> {
    return computed(() =>
      this.#holidays().find((holiday) => holiday.id === id),
    );
  }

  save(holiday: Holiday): void {
    this.#holidays.update((holidays) =>
      holidays.map((h) => {
        if (h.id === holiday.id) {
          return holiday;
        } else {
          return h;
        }
      }),
    );
  }

  add(holiday: Holiday): void {
    this.#holidays.update((holidays) => [...holidays, holiday]);
  }

  remove(id: number): void {
    this.#holidays.update((holidays) =>
      holidays.filter((holiday) => holiday.id !== id),
    );
  }
}
