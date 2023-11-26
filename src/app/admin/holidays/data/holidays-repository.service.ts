import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Holiday } from '@app/admin/holidays/model';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidays = signal<Holiday[]>([]);
  #httpClient = inject(HttpClient);
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
    return toSignal(
      this.#httpClient.get<Holiday | undefined>(`${this.#baseUrl}/${id}`),
    );
  }

  async save(holiday: Holiday): Promise<void> {
    throw new Error(`Cannot save ${holiday.name}`);
  }

  async add(holiday: Holiday): Promise<void> {
    await firstValueFrom(
      this.#httpClient.post<void>(`${this.#baseUrl}/${holiday.name}`, {}),
    );
    await this.#update();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.#httpClient.delete(`${this.#baseUrl}/${id}`));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(
      this.#httpClient.get<Holiday[]>(this.#baseUrl),
    );
    this.#holidays.set(holidays);
  }
}
