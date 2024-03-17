import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { fromHolidays, holidaysActions } from '@app/holidays/data';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <form>
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
          <mat-radio-button value="all">All</mat-radio-button>
          <mat-radio-button value="city">City</mat-radio-button>
          <mat-radio-button value="country">Country</mat-radio-button>
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
  ],
})
export class HolidaysComponent implements OnInit {
  #store = inject(Store);
  holidays = this.#store.selectSignal(fromHolidays.selectHolidaysWithFavourite);
  protected search = '';
  protected type = 'all';

  ngOnInit(): void {
    this.#store.dispatch(holidaysActions.load());
  }

  addFavourite(id: number) {
    this.#store.dispatch(holidaysActions.addFavourite({ id }));
  }

  removeFavourite(id: number) {
    this.#store.dispatch(holidaysActions.removeFavourite({ id }));
  }
}
