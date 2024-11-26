import { Component, computed, inject, signal } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '../holidays/model';

@Component({
  selector: 'app-newsletter',
  template: `<h2>Holidays</h2>
    <!--    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">-->
    <!--      <input data-testid="inp-email" formControlName="email" type="text" />-->
    <!--      <button data-testid="btn-subscribe">Subscribe</button>-->
    <!--    </form>-->

    <div>
      <input [(ngModel)]="titleFilter" placeholder="Title" />
      <input [(ngModel)]="descriptionFilter" placeholder="Description" />
    </div>
    <button class="m-y4" mat-raised-button (click)="load()">
      Load Something
    </button>

    <p>{{ prettyFilter() }}</p>

    <ul>
      @for (holiday of holidays(); track holiday) {
        <li>{{ holiday.title }}</li>
      }
    </ul>

    <p data-testid="p-message">{{ message() }}</p> `,
  standalone: true,
  imports: [ReactiveFormsModule, MatButton, FormsModule],
})
export class NewsletterComponent {
  titleFilter = signal('');
  descriptionFilter = signal('');

  prettyFilter = computed(
    () =>
      `Filter for title: '${this.titleFilter()}', for description '${this.descriptionFilter()}'`,
  );

  constructor() {}

  httpClient = inject(HttpClient);

  holidays = signal<Holiday[]>([]);

  holidayNames = computed(() => {
    return this.holidays().map((holiday) => holiday.title);
  });

  holidayCount = computed(() => {
    const value = this.holidayNames().length;
    return value;
  });

  message = signal('');

  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });

  handleSubmit() {
    if (this.formGroup.valid) {
      this.message.set('Thank you for your subscription');
    } else {
      this.message.set('Please provide an email');
    }
  }

  load() {
    const existingHolidays = this.holidays();
    this.httpClient.get<Holiday[]>('/holiday').subscribe((holidays) => {
      this.holidays.set(
        holidays.filter((holiday) =>
          holiday.title.startsWith(this.titleFilter()),
        ),
      );
    });
  }
}
