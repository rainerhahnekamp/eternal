import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Holiday } from '@eternal/admin/holidays/model';
import { dummyHolidays } from './dummy-holidays';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidayId = 1;
  #holidays: Holiday[] = [];
  #holidays$ = new BehaviorSubject<Holiday[]>(dummyHolidays);

  get holidays$(): Observable<Holiday[]> {
    return this.#holidays$.asObservable();
  }

  findById(id: number): Observable<Holiday | undefined> {
    return this.holidays$.pipe(
      map((holidays) => holidays.find((h) => h.id === id))
    );
  }

  save(holiday: Holiday): void {
    this.#holidays = this.#holidays.map((h) => {
      if (h.id === holiday.id) {
        return holiday;
      } else {
        return h;
      }
    });

    this.#holidays$.next(this.#holidays);
  }

  add(holiday: Holiday): void {
    this.#holidays = [...this.#holidays, { ...holiday, id: this.#holidayId++ }];
    this.#holidays$.next(this.#holidays);
  }

  remove(id: number): void {
    this.#holidays = this.#holidays.filter((holiday) => holiday.id !== id);
    this.#holidays$.next(this.#holidays);
  }
}
