import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { HolidayCard } from './holiday-card/holiday-card';
import { HolidayStore } from './holiday-store';
import { patchState } from '@ngrx/signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { Holiday, toHolidays } from './holiday';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <form>
      <div class="flex items-baseline">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input
            data-testid="inp-search"
            [(ngModel)]="query"
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
        <!--        <button color="primary" mat-raised-button>Search</button>-->
      </div>
    </form>

    <button mat-raised-button (click)="emptyHolidays()">Empty Holidays</button>

    <p>Status of the Holidays: {{ holidayStore.status() }}</p>

    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidayStore.holidays(); track holiday.id) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="holidayStore.addFavourite($event)"
          (removeFavourite)="holidayStore.removeFavourite($event)"
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysPage {
  protected readonly holidayStore = inject(HolidayStore);
  country = input.required<string>();

  // UI state
  protected query = signal('');
  protected type = signal('0');

  constructor() {
    const value = this.holidayStore.value;
    this.holidayStore.handleSearch(() => ({
      query: this.query(),
      type: Number(this.type()),
    }));
  }

  protected emptyHolidays() {
    this.holidayStore.emptyHolidays();
  }
}
