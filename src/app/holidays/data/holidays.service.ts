import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '@app/holidays/model';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HolidaysService {
  httpClient = inject(HttpClient);
  cache: Record<string, Holiday[]> = {};

  async findByName(name: string): Promise<Holiday[]> {
    if (this.cache[name]) {
      return this.cache[name];
    }

    const regex = new RegExp(name, 'i');
    const holidays = await lastValueFrom(
      this.httpClient.get<Holiday[]>('/holiday').pipe(
        map((holidays) =>
          holidays.filter((holiday) => {
            return holiday.title.match(regex) || holiday.teaser.match(regex);
          }),
        ),
      ),
    );

    this.cache[name] = holidays;

    return holidays;
  }
}
