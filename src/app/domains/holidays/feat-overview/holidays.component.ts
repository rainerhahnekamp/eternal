import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { HolidayCardComponent } from '../ui/holiday-card/holiday-card.component';
import { HolidayStore } from '../data/holidays-store';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { concatMap, delay, filter, map } from 'rxjs/operators';
import { concat, first, Observable, of } from 'rxjs';
import { ImagesLoadedService } from '../../../shared/ui/images-loaded.service';
import { createHoliday, Holiday } from '../model/holiday';

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
  standalone: true,
  imports: [
    AsyncPipe,
    HolidayCardComponent,
    NgForOf,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    HolidayCardComponent,
  ],
})
export class HolidaysComponent implements OnInit {
  #holidaysStore = inject(HolidayStore);
  #imagesLoadedService = inject(ImagesLoadedService);

  protected search = '';
  protected type = '0';

  #holidays$: Observable<(Holiday & { isFavourite: boolean })[]> = toObservable(
    this.#holidaysStore.holidaysWithFavourite,
  ).pipe(
    concatMap((holidays) => {
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
  );

  holidays = toSignal(this.#holidays$);

  ngOnInit(): void {
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
