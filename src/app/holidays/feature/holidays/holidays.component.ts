import { Component, computed, inject, signal } from '@angular/core';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HolidaysService, HolidayWithFavourite } from './holidays.service';

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

    <p>{{ prettySearch() }}</p>
    <p>Counter: {{ counter().value }}</p>

    <button (click)="changeHolidayTitles()">Change Holiday Titles</button>

    <div>
      <button mat-raised-button (click)="togglePrettySearch()">
        Toggle Pretty Search
      </button>
    </div>

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
  imports: [HolidayCardComponent, FormsModule, MatInputModule, MatButton],
})
export class HolidaysComponent {
  name = signal('');
  description = signal('');
  holidays = signal<HolidayWithFavourite[]>([]);
  counter = signal({ value: 0 });

  formGroup = inject(FormBuilder).nonNullable;

  showPrettySearch = signal(false);
  filteredHolidays = computed(() => {
    const name = this.name();
    return this.holidays().filter((holiday) => holiday.title.startsWith(name));
  });

  #holidaysService = inject(HolidaysService);

  addFavourite(id: number) {
    // this.#holidaysStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    // this.#holidaysStore.removeFavourite(id);
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }

  prettySearch = computed(() => {
    const value = `Found: ${this.holidays().length}`;
    return value;
  });

  printPrettySearch() {
    console.log(this.prettySearch());
  }

  async search() {
    const holidays = await this.#holidaysService.findByPromise(
      this.name(),
      this.description(),
    );
    this.holidays.update((value) => {
      value.push(...holidays);
      return value;
    });
  }

  togglePrettySearch() {
    this.showPrettySearch.update((value) => !value);
  }

  changeHolidayTitles() {
    this.holidays.update((holidays) =>
      holidays.map((holiday) => ({ ...holiday, title: 'Munich' })),
    );
  }
}
