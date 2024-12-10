import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  resource,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '../model/holiday';
import { lastValueFrom, map } from 'rxjs';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HolidayService {
  httpClient = inject(HttpClient);

  findById(id: number): Promise<Holiday | undefined> {
    console.log(`Requesting for holiday ${id}`);
    return lastValueFrom(
      this.httpClient.get<Holiday[]>(`/holiday`).pipe(
        tap((data) => console.log(data)),
        map((holidays) => holidays.find((h) => h.id === Number(id))),
      ),
    );
  }
}

@Component({
  selector: 'app-holiday-sub',
  template: `<a routerLink="/">Home</a>`,
  imports: [RouterLink],
  standalone: true,
})
export class SubComponent {}

@Component({
  selector: 'app-holiday',
  template: `
    <h3>{{ title() }}</h3>
    <h4>{{ finalDestination() }}</h4>
    <mat-form-field>
      <mat-label>Holiday ID</mat-label>
      <input [(ngModel)]="holidayId" name="id" matInput />
      <mat-hint>Title of Holiday</mat-hint>
    </mat-form-field>
    <form [formGroup]="holidayForm">
      <mat-form-field>
        <mat-label>Holiday Title</mat-label>
        <input formControlName="title" matInput />
        <mat-hint>Title of Holiday</mat-hint>
      </mat-form-field>

      <button mat-raised-button>Save</button>
    </form>
    <app-holiday-sub />
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatButton,
    SubComponent,
  ],
})
export class HolidayComponent {
  title = input('');
  finalDestination = model('');

  id = input(0);
  holidayId = linkedSignal(this.id);

  holidayService = inject(HolidayService);

  protected readonly holidayResource = resource({
    request: () => this.holidayId(),
    loader: (options) => {
      console.log(`ID: ${options.request}`);
      return this.holidayService.findById(options.request);
    },
  });

  private _formSyncEffect = effect(() => {
    const isLoading = this.holidayResource.isLoading();
    if (!isLoading) {
      const holiday = this.holidayResource.value();
      console.log('Holiday %o', holiday);
      if (holiday) {
        this.holidayForm.setValue({ title: holiday.title });
      }
    }
  });

  holidayForm = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
  });
}
