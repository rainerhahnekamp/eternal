import { Component, inject, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Configuration } from '@app/shared';

@Component({
  selector: 'app-home',
  template: `<h2 data-testid="greeting">Welcome to Eternal</h2>
    <p data-testid="txt-greeting-1">
      Eternal is an imaginary travel agency and is used as training application for Angular
      developers.
    </p>
    <p data-testid="txt-greeting-2">
      You can click around, do whatever you want but don't expect to be able to book a real holiday
      😉.
    </p>
    <h3 class="mt-8 text-l font-bold">Settings</h3>
    <form [formGroup]="formGroup">
      <p>
        <mat-slide-toggle formControlName="mockCustomers" data-testid="tgl-mock-customers"
          >Mock Customers
        </mat-slide-toggle>
      </p>
      <p>
        <mat-slide-toggle formControlName="mockHolidays" data-testid="tgl-mock-holidays"
          >Mock Holidays
        </mat-slide-toggle>
      </p>
    </form> `,
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule]
})
export class HomeComponent implements OnInit {
  config = inject(Configuration);
  formGroup = inject(NonNullableFormBuilder).group({
    mockCustomers: [true],
    mockHolidays: [true]
  });

  mockCustomers = new FormControl(true, {
    nonNullable: true
  });

  mockHolidays = new FormControl(true, {
    nonNullable: true
  });

  ngOnInit(): void {
    this.formGroup.setValue({
      mockCustomers: this.config.mockCustomers,
      mockHolidays: this.config.mockHolidays
    });
    this.formGroup.valueChanges.subscribe(() =>
      this.config.updateFeatures(this.formGroup.getRawValue())
    );
  }
}
