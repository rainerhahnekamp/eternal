import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { HolidayCard } from './holiday-card/holiday-card';
import { HttpClient } from '@angular/common/http';
import { Holiday } from './holiday';
import { BehaviorSubject, combineLatest, filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
        <button color="primary" mat-raised-button>Search</button>
      </div>
    </form>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays$ | async; track holiday.id) {
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
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysPage {
  readonly #httpClient = inject(HttpClient);
  readonly #baseUrl = '/holiday';

  // UI state
  protected query = '';
  protected type = '0';

  // State
  readonly #holidays$ = new BehaviorSubject<Holiday[]>([]);
  readonly favouriteIds$ = new BehaviorSubject<number[]>([]);
  readonly #search$ = new BehaviorSubject({
    query: this.query,
    type: this.type,
  });

  protected readonly holidays$ = combineLatest([
    this.#holidays$,
    this.favouriteIds$,
    this.#search$,
  ]).pipe(
    map(([holidays, favouriteIds, search]) => {
      return holidays
        .map((holiday) => ({
          ...holiday,
          isFavourite: favouriteIds.includes(holiday.id),
        }))
        .filter(
          (holiday) =>
            holiday.title
              .toLowerCase()
              .startsWith(search.query.toLowerCase()) &&
            (search.type === '0' || holiday.typeId === Number(search.type)),
        );
    }),
  );

  constructor() {
    this.#load();
  }

  #load() {
    this.#httpClient
      .get<Holiday[]>(this.#baseUrl)
      .subscribe((holidays) => this.#holidays$.next(holidays));
  }

  protected addFavourite(id: number): void {
    this.favouriteIds$.next([...this.favouriteIds$.value, id]);
  }

  protected removeFavourite(id: number): void {
    this.favouriteIds$.next(
      this.favouriteIds$.value.filter((favouriteId) => favouriteId !== id),
    );
  }

  protected handleSearch(): void {
    this.#search$.next({
      query: this.query,
      type: this.type,
    });
  }

  protected readonly filter = filter;
}
