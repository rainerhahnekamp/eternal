import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { HolidayCard } from './holiday-card/holiday-card';
import { HttpClient } from '@angular/common/http';
import { Holiday } from './holiday';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <form (ngSubmit)="handleSearch()">
      <div class="flex items-baseline">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input
            data-testid="inp-search"
            [ngModel]="search()"
            (ngModelChange)="search.set($event)"
            matInput
            name="search"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-radio-group
          [ngModel]="type()"
          (ngModelChange)="type.set($event)"
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
      @for (holiday of holidaysWithFavourite(); track holiday.id) {
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
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = '/holiday';

  // State signals
  protected readonly holidays = signal<Holiday[]>([]);
  protected readonly favouriteIds = signal<number[]>([]);
  protected readonly filter = signal({ query: '', type: 0 });

  // UI state as signals
  protected readonly search = signal('');
  protected readonly type = signal('0');

  // Computed values
  protected readonly filteredHolidays = computed(() => {
    const { query, type } = this.filter();
    return this.holidays()
      .filter((holiday) => holiday.title.includes(query))
      .filter((holiday) => !type || holiday.typeId === type);
  });

  protected readonly holidaysWithFavourite = computed(() =>
    this.filteredHolidays().map((holiday) => ({
      ...holiday,
      isFavourite: this.favouriteIds().includes(holiday.id),
    })),
  );

  constructor() {
    effect(() => {
      this.#load();
    });
  }

  async #load(): Promise<void> {
    const holidays = await lastValueFrom(
      this.httpClient.get<Holiday[]>(this.baseUrl),
    );
    this.holidays.set(holidays);
  }

  protected addFavourite(id: number): void {
    this.favouriteIds.update((ids) => [...ids, id]);
  }

  protected removeFavourite(id: number): void {
    this.favouriteIds.update((ids) =>
      ids.filter((favouriteId) => favouriteId !== id),
    );
  }

  protected handleSearch(): void {
    this.filter.set({
      query: this.search(),
      type: Number(this.type()),
    });
  }
}
