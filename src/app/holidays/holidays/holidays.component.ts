import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { createHoliday } from '../model';
import { ImagesLoadedService } from '@app/shared';
import { HolidaysRepository } from '../+state';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hiddenVienna = createHoliday({
  id: -1,
  title: 'Hidden Vienna',
  teaser: 'Secret Holiday Unlocked',
  imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg',
  description: 'Congratulations, your patience paid off. You have discovered our Easter egg.'
});

@Component({
  selector: 'app-holidays',
  template: `<div class="container">
    <app-holiday-card
      *ngFor="let holiday of holidays$ | async"
      [holiday]="holiday"
      data-testid="holiday-card"
    />
  </div> `,
  styleUrls: ['./holidays.component.scss'],
  standalone: true,
  imports: [HolidayCardComponent, NgForOf, AsyncPipe]
})
export class HolidaysComponent {
  #repo = inject(HolidaysRepository);
  #store = inject(Store);
  #imagesLoadedService = inject(ImagesLoadedService);

  holidays$ = this.#repo.holidays$;

  // holidays$ = this.#store.select(fromHolidays.holidays).pipe(
  //   concatMap((holidays) =>
  //     holidays.length
  //       ? concat(
  //           of(holidays),
  //
  //           this.#imagesLoadedService.loaded$.pipe(
  //             filter(Boolean),
  //             map(() => [...holidays, hiddenVienna]),
  //             delay(1000),
  //             first()
  //           )
  //         )
  //       : of(holidays)
  //   )
  // );
}
