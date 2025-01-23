import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  debounceTime,
  exhaustMap,
  map,
  Observable,
  shareReplay,
  Subject,
} from 'rxjs';
import { Holiday } from './holidays/model';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `<input [formControl]="name" placeholder="Title" />
    <h3>Found Holidays</h3>
    <ul>
      @for (holiday of holidays$ | async; track holiday) {
        <li>Holiday {{ holiday.title }}</li>
      }
    </ul> `,
  imports: [ReactiveFormsModule, MatSlideToggleModule, AsyncPipe],
})
export class HomeComponent {
  name = new FormControl<string>('', { nonNullable: true });
  httpClient = inject(HttpClient);

  holidays$: Observable<Holiday[]> = this.name.valueChanges.pipe(
    exhaustMap((value) => this.requestHolidays(value)),
  );

  requestHolidays(name: string): Observable<Holiday[]> {
    return this.httpClient
      .get<Holiday[]>(`https://api.eternal-holidays.net/holiday?name=${name}`)
      .pipe(
        debounceTime(300),
        filter((value) => value.length > 3),
        map((holidays) =>
          holidays.filter((holiday) => holiday.title.startsWith(name)),
        ),
      );
  }

  _ngOnInit() {
    // const subject = new ReplaySubject();
    // subject.next(1);
    // subject.subscribe((value) => console.log(`Subscription 1 ${value}`));
    //
    // subject.next(2);
    // subject.subscribe((value) => console.log(`Subscription 2 ${value}`));
    //
    // subject.next(3);
    // subject.subscribe((value) => console.log(`Subscription 3 ${value}`));

    const get = () =>
      this.httpClient.get<Holiday[]>(
        'https://api.eternal-holidays.net/holiday',
      );

    // inside of share()
    function createSharedHoliday() {
      const holidays$ = new Subject<Holiday[]>();

      get().subscribe({ next: (holidays) => holidays$.next(holidays) });
      return holidays$.asObservable();
    }

    const holidays$ = get().pipe(
      // share({
      //   resetOnComplete: false,
      //   resetOnRefCountZero: false,
      //   connector: () => new ReplaySubject(),
      // }),
      shareReplay(),
    );

    holidays$.subscribe((holidays) => console.log(holidays));
    holidays$.subscribe((holidays) => console.log(holidays));

    setTimeout(() => {
      console.log('starting 3rd subscription');
      holidays$.subscribe((holidays) => console.log(holidays));
    }, 500);

    console.log('Finished...');
  }
}
