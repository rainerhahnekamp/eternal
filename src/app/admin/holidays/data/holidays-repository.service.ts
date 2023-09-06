import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { Holiday } from '@app/admin/holidays/model';
import { HolidaysService } from '@app/admin/holidays/openapi';

export type AddHoliday = {
  name: string;
  description: string;
  cover: File;
};
export type EditHoliday = AddHoliday & { id: number };

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidays$ = new BehaviorSubject<Holiday[]>([]);
  #holidaysService = inject(HolidaysService);
  #initialized = false;

  get holidays$(): Observable<Holiday[]> {
    if (!this.#initialized) {
      this.#update();
      this.#initialized = true;
    }
    return this.#holidays$.asObservable();
  }

  findById(id: number): Observable<Holiday | undefined> {
    return this.holidays$.pipe(
      map((holidays) => holidays.find((holiday) => holiday.id === id)),
    );
  }

  async save(holiday: EditHoliday) {
    const { cover, ...holidayDto } = holiday;
    await firstValueFrom(this.#holidaysService.save(holidayDto, cover));
    this.#update();
  }

  async add(holiday: AddHoliday): Promise<void> {
    const { cover, ...holidayDto } = holiday;
    await firstValueFrom(this.#holidaysService.add(holidayDto, cover));
    this.#update();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.#holidaysService.remove(id));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(this.#holidaysService.findAll());

    this.#holidays$.next(
      holidays.map((holiday) => ({
        ...holiday,
        coverLink: `http://localhost:8080/api/holidays/${holiday.id}/cover`,
      }))
    );
  }
}
