import { Component, inject, input, signal } from '@angular/core';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HolidaysStore } from './holidays.store.ng';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <form (ngSubmit)="search()">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input [(ngModel)]="name" name="name" matInput />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Description</mat-label>
        <input [(ngModel)]="description" name="description" matInput />
      </mat-form-field>

      <button mat-raised-button>Search</button>
    </form>

    <h3>{{ prettySearch() }}</h3>

    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays(); track byId($index, holiday)) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="addFavourite($event)"
          (removeFavourite)="removeFavourite($event)"
        >
        </app-holiday-card>
      }
    </div> `,
  imports: [HolidayCardComponent, FormsModule, MatInputModule, MatButton],
})
export class HolidaysComponent {
  protected readonly name = signal('');
  protected readonly description = signal('');

  selectedHolidayId = input.required<number>();

  constructor() {
    this.#holidaysStore.setSelectedHoliday(this.selectedHolidayId);
  }

  readonly #holidaysStore = inject(HolidaysStore);

  protected readonly holidays = this.#holidaysStore.holidaysWithFavourite;
  protected readonly prettySearch = this.#holidaysStore.prettySearch;

  addFavourite(id: number) {
    this.#holidaysStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#holidaysStore.removeFavourite(id);
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }

  search() {
    this.#holidaysStore.search({
      name: this.name(),
      description: this.description(),
    });
  }
}
