import { Component, inject, linkedSignal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { HolidaysStore } from './data/holidays-store';
import { HolidayCard } from './ui/holiday-card/holiday-card';
import { HolidaysToolbar } from './ui/holidays-toolbar';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <p>{{ holidaysStore.username() }}</p>
    <app-holidays-toolbar
      [lastUpdatedName]="holidaysStore.lastUpdatedName()"
      (saveForOffline)="holidaysStore.syncToStorage()"
    ></app-holidays-toolbar>
    <form [formRoot]="filterForm">
      <div class="flex items-baseline">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input
            data-testid="inp-search"
            [formField]="filterForm.query"
            matInput
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-radio-group
          [formField]="filterForm.type"
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
      @for (holiday of holidaysStore.holidays(); track holiday.id) {
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
    MatIconModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    HolidayCard,
    FormRoot,
    FormField,
    HolidaysToolbar,
  ],
})
export class HolidaysPage {
  protected readonly holidaysStore = inject(HolidaysStore);
  protected readonly filters = linkedSignal(() => {
    const { query, type } = this.holidaysStore.filter();

    return { query, type: String(type) };
  });

  protected readonly filterForm = form(this.filters, {
    submission: {
      action: async () => {
        const { query, type } = this.filters();
        this.holidaysStore.search(query, Number(type));
      },
    },
  });

  protected addFavourite(id: number) {
    this.holidaysStore.addFavourite(id);
  }

  protected removeFavourite(id: number) {
    this.holidaysStore.removeFavourite(id);
  }
}
