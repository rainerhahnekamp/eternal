import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '@app/holidays/model';
import { delay, map } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';
import { holidaysResponse } from '@app/holidays/data/holidays-response';

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
      of(holidaysResponse).pipe(
        delay(250),
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
