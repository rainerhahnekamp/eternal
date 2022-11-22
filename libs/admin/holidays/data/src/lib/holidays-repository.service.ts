import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Holiday } from '@eternal/admin/holidays/model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #httpClient = inject(HttpClient);
  get holidays$(): Observable<Holiday[]> {
    return this.#httpClient.get<Holiday[]>('/api/holidays');
  }

  findById(id: number): Observable<Holiday | undefined> {
    return this.#httpClient.get<Holiday>(`/api/holidays/${id}`);
  }

  save(holiday: Holiday): Observable<void> {
    return this.#httpClient.put<void>(`/api/holidays`, holiday);
  }

  add(holiday: Holiday): Observable<any> {
    return this.#httpClient.post<void>(`/api/holidays`, holiday);
  }

  remove(id: number): Observable<void> {
    return this.#httpClient.delete<void>(`/api/holidays/${id}`);
  }
}
