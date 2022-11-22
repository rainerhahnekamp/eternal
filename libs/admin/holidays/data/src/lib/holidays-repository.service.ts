import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Holiday } from '@eternal/admin/holidays/model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidays$ = new BehaviorSubject<Holiday[]>([]);
  #httpClient = inject(HttpClient);
  #initialized = false;

  get holidays$(): Observable<Holiday[]> {
    if (!this.#initialized) {
      this.#update();
      this.#initialized = true;
    }
    return this.#holidays$.asObservable();
  }

  findById(id: number): Observable<Holiday | undefined> {
    return this.#httpClient.get<Holiday | undefined>(`/holidays/${id}`);
  }

  async save(holiday: Holiday) {
    await firstValueFrom(this.#httpClient.put<void>(`/holidays`, holiday));
    await this.#update();
  }

  async add(holiday: Holiday): Promise<void> {
    await firstValueFrom(this.#httpClient.post<void>(`/holidays`, holiday));
    await this.#update();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.#httpClient.delete(`/holidays/${id}`));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(
      this.#httpClient.get<Holiday[]>('/holidays')
    );
    this.#holidays$.next(holidays);
  }
}
