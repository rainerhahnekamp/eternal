import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { HolidayCardComponent } from '../ui/holiday-card/holiday-card.component';
import { HolidaysStore } from '../data/holidays-store';
import { JsonPipe } from '@angular/common';
import { derivedFrom } from 'ngxtension/derived-from';
import { debounce, debounceTime, pipe } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HolidaySignalStore } from '../data/basic-holiday-store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, tap } from 'rxjs/operators';
import { injectDispatch } from '@ngrx/signals/events';
import { holidayEvents } from '../data/holiday-events';

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
        <button mat-raised-button (click)="reloadResource()">Reload</button>
      </div>
    </form>

    <p>Anzahl der Holidays: {{ holidaysCount() }}</p>

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
    HolidayCardComponent,
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
  readonly #holidaysStore = inject(HolidaySignalStore);
  readonly events = injectDispatch(holidayEvents);

  protected holidays = this.#holidaysStore.holidays;

  protected search = signal('');
  protected type = signal('0');

  protected searchParams = computed(() => ({
    query: this.search(),
    type: this.type(),
  }));

  protected readonly holidaysCount = computed(() => this.holidays().length);

  constructor() {
    // this.#holidaysStore.load(this.searchParams);
  }

  ngOnInit() {}

  addFavourite(id: number) {
    // this.#holidaysStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    // this.#holidaysStore.removeFavourite(id);
  }

  handleSearch() {
    this.events.load(this.searchParams());
  }

  reloadResource() {}
}
