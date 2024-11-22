import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FormErrorsComponent } from '../shared/form/form-errors.component';
import { NewsletterService } from './newsletter.service';
import { SubNewsletterComponent } from './sub-newsletter.component';

function fakeAsyncValidator(ac: AbstractControl) {
  return Promise.resolve().then(() => ({}));
}

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <app-sub-newsletter />
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

    <p data-testid="p-counter">
      Count of successful subscriptions: {{ subscriptionCount() }}
    </p>
    @if (message()) {
      <p data-testid="p-message">{{ message() }}</p>
    }`,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    FormErrorsComponent,
    SubNewsletterComponent,
  ],
})
export class NewsletterComponent {
  message = signal('');
  subscriptionCount = signal(0);

  effectRef = effect(
    () => {
      const value = this.message();
      if (!value || value === 'Please provide an email') {
        return;
      }

      this.subscriptionCount.update((value) => value + 1);
    },
    { allowSignalWrites: true },
  );

  newsletterService = inject(NewsletterService);

  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required, fakeAsyncValidator],
  });

  handleSubmit() {
    if (this.formGroup.valid) {
      this.newsletterService
        .send(this.formGroup.getRawValue().email)
        .subscribe(() => {
          this.message.set('Thank you for your subscription');
        });
    } else {
      this.message.set('Please provide an email');
    }
  }
}
