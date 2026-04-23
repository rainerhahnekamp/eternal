import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NewsletterClient } from './newsletter-client';

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form [formRoot]="newsletterForm">
      <div class="flex flex-col max-w-fit items-center">
        <mat-form-field>
          <mat-label>Address</mat-label>
          <input
            data-testid="inp-email"
            [formField]="newsletterForm.email"
            matInput
          />
          <mat-icon matSuffix>location_on</mat-icon>
          <mat-hint>Please enter your email</mat-hint>
        </mat-form-field>
        <!-- <app-form-errors [control]="formGroup.controls.email" /> -->
        <button mat-raised-button data-testid="btn-subscribe" class="my-4">
          Subscribe
        </button>
      </div>
    </form>

    <p data-testid="p-message" aria-live="assertive" role="status">
      {{ message() }}
    </p>`,
  imports: [
    FormField,
    FormRoot,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
  ],
})
export default class NewsletterPage {
  message = signal('');

  model = signal({
    email: '',
  });

  newsletterForm = form(
    this.model,
    (path) => {
      required(path.email);
    },
    {
      submission: {
        action: async () => {
          this.newsletterClient.send(this.model().email).subscribe(() => {
            this.message.set('Thank you for your subscription');
          });
        },
        onInvalid: () => this.message.set('Please provide an email'),
      },
    },
  );

  private readonly newsletterClient = inject(NewsletterClient);
}
