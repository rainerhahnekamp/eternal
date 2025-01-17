import { Component, inject } from '@angular/core';
import { exhaustMap, map, Observable } from "rxjs";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Holiday } from './domains/holidays/model/holiday';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  template: `<input [formControl]="formControl" />
    <ul>
      @for (holiday of holidays$ | async; track holiday) {
        <li>{{ holiday.title }}</li>
      }
    </ul> `,
  imports: [ReactiveFormsModule, AsyncPipe],
})
export class HomeComponent  {
  formControl = new FormControl('', { nonNullable: true });
  protected readonly holidays$: Observable<Holiday[]> | undefined;
  httpClient = inject(HttpClient);

  constructor() {
    const getHolidays = (name: string): Observable<Holiday[]> => {
      return new Observable<Holiday[]>((subscriber) => {
        fetch('https://api.eternal-holidays.net/holiday')
          .then((res) => res.json())
          .then((data) => {
            const holidays: Holiday[] = data;
            subscriber.next(
              holidays.filter((holiday) => holiday.title.startsWith(name)),
            );
            subscriber.complete();
          });
      });
    };

    this.holidays$ = this.formControl.valueChanges.pipe(
      exhaustMap((name) =>
        this.httpClient
          .get<Holiday[]>(`https://api.eternal-holidays.net/holiday?title=${name}`)
          .pipe(
            map((holidays) =>
              holidays.filter((holiday) => holiday.title.startsWith(name)),
            ),
          ),
      ),
    );
  }
}
