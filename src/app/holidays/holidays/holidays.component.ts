import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { createHoliday } from '../model/holiday';
import { ImagesLoadedService } from '../../shared/images-loaded.service';
import { concatMap, delay, filter, map } from 'rxjs/operators';
import { concat, first, of } from 'rxjs';

const hiddenVienna = createHoliday({
  id: -1,
  title: 'Hidden Vienna',
  teaser: 'Secret Holiday Unlocked',
  imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg',
  description: 'Congratulations, your patience paid off. You have discovered our Easter egg.'
});

@Component({
  selector: 'eternal-holidays',
  template: `<div class="container">
    <eternal-holiday-card
      *ngFor="let holiday of holidays$ | async"
      [holiday]="holiday"
      data-testid="holiday-card"
    />
  </div> `,
  styleUrls: ['./holidays.component.scss'],
  standalone: true,
  imports: [HolidayCardComponent, NgForOf, AsyncPipe]
})
export class HolidaysComponent implements OnInit {
  #store = inject(Store);
  #imagesLoadedService = inject(ImagesLoadedService);

  holidays$ = this.#store.select(fromHolidays.holidays).pipe(
    concatMap((holidays) =>
      holidays.length
        ? concat(
            of(holidays),

            this.#imagesLoadedService.loaded$.pipe(
              filter(Boolean),
              map(() => [...holidays, hiddenVienna]),
              delay(1000),
              first()
            )
          )
        : of(holidays)
    )
  );

  ngOnInit(): void {
    this.#store.dispatch(holidaysActions.load());
  }
}
