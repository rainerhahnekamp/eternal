import { Component, inject } from '@angular/core';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { FormsModule } from '@angular/forms';
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

    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays; track byId($index, holiday)) {
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
  name = '';
  description = '';
  holidays = [] as HolidayWithFavourite[];

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

  async search() {
    this.holidays = await this.#holidaysService.findByPromise(
      this.name,
      this.description,
    );
  }
}
