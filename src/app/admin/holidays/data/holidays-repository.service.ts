import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Holiday } from '@app/admin/holidays/model';
import { HolidayService } from '@app/admin/holidays/openapi';

export type AddHoliday = {
  name: string;
  description: string;
  cover: File;
};
export type EditHoliday = AddHoliday & { id: number };

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidays = signal<Holiday[]>([]);
  #holidayService = inject(HolidayService);
  #initialized = false;
  #baseUrl = 'http://localhost:8080/api/holiday';

  get holidays(): Signal<Holiday[]> {
    if (!this.#initialized) {
      this.#update();
      this.#initialized = true;
    }
    return this.#holidays.asReadonly();
  }

  findById(id: number): Signal<Holiday | undefined> {
    const holiday = signal<Holiday | undefined>(undefined);
    this.#holidayService.findById(id).subscribe((value) => holiday.set(value));
    return holiday;
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
    await firstValueFrom(this.#holidayService.remove(id));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(this.#holidaysService.findAll());

    this.#holidays$.set(
      holidays.map((holiday) => ({
        ...holiday,
        coverLink: `http://localhost:8080/api/holidays/${holiday.id}/cover`,
      }))
    );
  }
}
