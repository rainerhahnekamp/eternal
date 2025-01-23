import { Component, computed, effect, inject, signal } from '@angular/core';
import { Holiday } from '@app/holidays/model';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HolidayCardComponent } from '../../ui';
import { HolidayStore } from './holiday-store.service';

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

    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays(); track holiday) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="addFavourite($event)"
          (removeFavourite)="removeFavourite($event)"
        >
        </app-holiday-card>
      }
    </div> `,
  imports: [FormsModule, MatInputModule, MatButton, HolidayCardComponent],
})
export class HolidaysComponent {
  name = signal('');
  description = signal('');

  #holidaysStore = inject(HolidayStore);

  searchParams = computed(() => ({
    name: this.name(),
    description: this.description(),
  }));

  constructor() {
    this.#holidaysStore.search1(this.searchParams);
  }

  holidays = this.#holidaysStore.holidays;

  addFavourite(id: number) {
    this.#holidaysStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#holidaysStore.removeFavourite(id);
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }

  logEffect = effect(() => {
    console.log(`Effect: ${this.name()}`);
  });

  search() {}
}
