import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FormErrorsComponent } from '../shared/form/form-errors.component';
import { NewsletterClient } from './newsletter-client';
import { HomeLink } from './home-link';

@Component({
  selector: 'app-newsletter',
  /**
   * 1. Handled DOM Event
   * 2. Signal
   * 3. async pipe
   * 4. cdr.markForCheck(), cdr.detectChanges()
   */
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>{{ title() }}</h2>
    <app-home-link />
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <div class="flex flex-col max-w-fit items-center">
        <mat-form-field>
          <mat-label>Address</mat-label>
          <input data-testid="inp-email" formControlName="email" matInput />
          <mat-icon matSuffix>location_on</mat-icon>
          <mat-hint>Please enter your email</mat-hint>
        </mat-form-field>
        <app-form-errors [control]="formGroup.controls.email" />
        <button mat-raised-button data-testid="btn-subscribe" class="my-4">
          Subscribe
        </button>
      </div>
    </form>
    @if (message()) {
      <p role="status" data-testid="p-message">{{ message() }}</p>
    }`,
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    FormErrorsComponent,
    HomeLink,
  ],
})
export default class NewsletterPage {
  message = signal('');
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });
  newsletterClient = inject(NewsletterClient);

  title = input('');

  handleSubmit() {
    if (this.formGroup.valid) {
      this.newsletterClient
        .send(this.formGroup.getRawValue().email)
        .subscribe(() => this.message.set('Thank you for your subscription'));
    } else {
      this.message.set('Please provide an email');
    }
  }
}
