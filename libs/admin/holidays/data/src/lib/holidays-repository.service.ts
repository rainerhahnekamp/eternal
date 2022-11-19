import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Holiday } from '@eternal/admin/holidays/model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HolidaysRepositoryService {
  #httpClient = inject(HttpClient);
  get holidays$(): Observable<Holiday> {
    return this.#httpClient.get<Holiday[]>('/api/admin/holiday');
  }
}
