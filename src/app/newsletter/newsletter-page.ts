import { Component, signal } from '@angular/core';

import { FormRoot, email, form, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { TextFieldComponent } from '../shared/form/text-field';

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form [formRoot]="newsletterForm">
      <div class="flex flex-col max-w-fit items-center">
        <app-text-field
          [fieldTree]="newsletterForm.email"
          label="Email"
          placeholder="Enter your email"
        />

        <button
          mat-raised-button
          data-testid="btn-subscribe"
          class="my-4"
          [disabled]="newsletterForm().invalid()"
        >
          Subscribe
        </button>
      </div>
    </form>`,
  imports: [MatButton, FormRoot, TextFieldComponent],
})
export default class NewsletterPage {
  private readonly newsletterModel = signal({ email: '' });

  protected readonly message = signal('');
  protected readonly newsletterForm = form(
    this.newsletterModel,
    (path) => {
      required(path.email, { message: 'Please provide an email' });
      email(path.email, { message: 'Please provide a valid email' });
    },
    {
      submission: {
        action: async () => {
          this.message.set('Thank you for your subscription');
        },
      },
    },
  );
}
