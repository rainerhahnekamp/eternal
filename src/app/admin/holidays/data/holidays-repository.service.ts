import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Holiday } from '@app/admin/holidays/model';
import { HolidayService } from '@app/admin/holidays/openapi';

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

  async save(holiday: Holiday) {
    await firstValueFrom(this.#holidayService.save(holiday));
    await this.#update();
  }

  async add(holiday: Holiday): Promise<void> {
    await firstValueFrom(this.#holidayService.add(holiday));
    await this.#update();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.#holidayService.remove(id));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(this.#holidayService.findAll());
    this.#holidays.set(holidays);
  }
}
