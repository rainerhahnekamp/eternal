import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { HolidayCard } from './holiday-card/holiday-card';
import { injectHolidaysStore } from './holidays-store';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <form (ngSubmit)="handleSearch()">
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

    <button (click)="updateFirstname('Joe')" mat-raised-button>
      Change Firstname
    </button>
    {{ prettyUser() }}
    <p>Current Search: {{ holidaysStore.prettySearch() }}</p>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidaysStore.filteredHolidays(); track holiday.id) {
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysPage {
  protected readonly holidaysStore = injectHolidaysStore();

  // Component state
  protected query = signal('');
  protected type = signal('0');

  constructor() {
    this.holidaysStore.load(
      computed(() => ({ query: this.query(), type: this.type() })),
    );
  }

  user = signal(
    { firstname: 'John', lastname: 'Doe' },
    { equal: (user1, user2) => false },
  );
  prettyUser = computed(() => {
    return `${this.user().firstname} ${this.user().lastname}`;
  });

  updateFirstname(firstname: string): void {
    this.user.update((user) => {
      user.firstname = firstname;
      return user;
    });
  }

  protected addFavourite(id: number): void {
    this.holidaysStore.addFavourite(id);
  }

  protected removeFavourite(id: number): void {
    this.holidaysStore.removeFavourite(id);
  }

  protected handleSearch(): void {
    console.log('noop');
  }
}
