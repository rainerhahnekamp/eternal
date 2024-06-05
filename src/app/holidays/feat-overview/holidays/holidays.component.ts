import { Component, computed, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { Holiday } from '@app/holidays/model';
import { HolidaysService } from '@app/holidays/data';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <p>{{ prettySearch() }}</p>
    <form (ngSubmit)="handleSubmit()">
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
        <button color="primary" mat-raised-button [disabled]="isLoading()">
          Search
        </button>
      </div>
    </form>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays(); track holiday.id) {
        <app-holiday-card [holiday]="holiday"> </app-holiday-card>
      }
    </div> `,
  standalone: true,
  imports: [
    AsyncPipe,
    HolidayCardComponent,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
  ],
})
export class HolidaysComponent {
  #holidaysService = inject(HolidaysService);

  protected readonly holidays = signal(new Array<Holiday>());
  protected readonly search = signal('');
  protected readonly type = signal('all');
  protected readonly isLoading = signal(false);

  prettySearch = computed(() => {
    const prettySearch = `Query ${this.search()} returned ${this.holidays().length} hits.`;
    console.debug(prettySearch);
    return prettySearch;
  });

  // #logEffect = effect(() => this.prettySearch());

  protected async handleSubmit() {
    this.isLoading.set(true);
    this.holidays.set([]);
    this.holidays.set(await this.#holidaysService.findByName(this.search()));
    this.isLoading.set(false);
  }
}
