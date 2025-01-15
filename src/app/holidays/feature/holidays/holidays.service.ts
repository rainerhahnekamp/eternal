import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '../../model';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HolidaysService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = '/holiday';

  find(): Observable<Holiday[]> {
    return this.#httpClient.get<Holiday[]>(this.#url);
  }

  findByPromise(): Promise<Holiday[]> {
    return lastValueFrom(this.find());
  }
}
