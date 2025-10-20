import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { HolidaysStore } from './data/holidays-store';
import { HolidayCard } from './ui/holiday-card/holiday-card';

import { createHoliday } from '../model/holiday';
import { concat, concatMap, filter, first, map, of, pipe } from 'rxjs';
import { ImagesLoadedService } from '../../../shared/ui/images-loaded.service';
import { delay } from 'rxjs/operators';
import { derivedFrom } from 'ngxtension/derived-from';

const hiddenVienna = {
  ...createHoliday({
    id: -1,
    title: 'Hidden Vienna',
    teaser: 'Secret Holiday Unlocked',
    imageUrl: 'https://api.eternal-holidays.net/assets/vienna.jpg',
    description:
      'Congratulations, your patience paid off. You have discovered our Easter egg.',
  }),
  isFavourite: false,
};

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <form (ngSubmit)="handleSearch()">
      <div class="flex items-baseline">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input
            data-testid="inp-search"
            [(ngModel)]="search"
            matInput
            name="search"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-radio-group
          [(ngModel)]="type"
          name="type"
          color="primary"
          class="mx-4"
        >
          <mat-radio-button value="0">All</mat-radio-button>
          <mat-radio-button value="1">City</mat-radio-button>
          <mat-radio-button value="2">Country</mat-radio-button>
        </mat-radio-group>
        <button color="primary" mat-raised-button>Search</button>
      </div>
    </form>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays(); track holiday.id) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="addFavourite($event)"
          (removeFavourite)="removeFavourite($event)"
        >
        </app-holiday-card>
      }
    </div> `,
  imports: [
    HolidayCard,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    HolidayCard,
  ],
})
export class HolidaysPage {
  readonly #holidaysStore = inject(HolidaysStore);
  readonly #imagesLoadedService = inject(ImagesLoadedService);

  holidays = derivedFrom(
    [this.#holidaysStore.holidaysWithFavourite],
    pipe(
      concatMap(([holidays]) => {
        return holidays.length
          ? concat(
              of(holidays),
              this.#imagesLoadedService.loaded$.pipe(
                filter(Boolean),
                map(() => [...holidays, hiddenVienna]),
                delay(1000),
                first(),
              ),
            )
          : of(holidays);
      }),
    ),
    { initialValue: [] },
  );

  protected search = '';
  protected type = '0';

  constructor() {
    this.#holidaysStore.load();
  }

  addFavourite(id: number) {
    this.#holidaysStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#holidaysStore.removeFavourite(id);
  }

  handleSearch() {
    this.#holidaysStore.search(this.search, Number(this.type));
  }
}
