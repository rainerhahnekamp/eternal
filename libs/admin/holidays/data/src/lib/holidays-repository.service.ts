import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { Holiday } from '@eternal/admin/holidays/model';
import { HolidaysService } from '@eternal/openapi';

export type AddHoliday = {
  name: string;
  description: string;
  cover: File;
};

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
      map((holidays) => holidays.find((holiday) => holiday.id === id))
    );
  }

  async save(holiday: Holiday) {
    // await firstValueFrom(this.#holidaysService.save(holiday));
    await this.#update();
  }

  async add(holiday: AddHoliday): Promise<void> {
    const formData = new FormData();
    const { cover, ...holidayDto } = holiday;

    this.#holidaysService.add(holidayDto, cover).subscribe();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.#holidaysService.remove(id));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(this.#holidaysService.findAll());
    this.#holidays$.next(holidays as Holiday[]);
  }
}
