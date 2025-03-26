import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from "@angular/material/button";
import { FormErrorsComponent } from '../shared/form/form-errors.component';
import { NewsletterService } from './newsletter.service';

import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home-link",
  imports: [
    RouterLink,
    MatAnchor
  ],
  template: `<a mat-raised-button routerLink="/">Home</a>`
})
export class HomeLinkComponent {
}


@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
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

  <p data-testid="p-message">{{ message() }}</p>`,
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    FormErrorsComponent,
    HomeLinkComponent,
  ],
})
export default class NewsletterComponent {
  protected readonly message = signal('');
  protected readonly formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });

  readonly #newsletterService = inject(NewsletterService);

  protected handleSubmit() {
    if (this.formGroup.valid) {
      this.#newsletterService
        .send(this.formGroup.getRawValue().email)
        .subscribe(() => this.message.set('Thank you for your subscription'));
    } else {
      this.message.set('Please provide an email');
    }
  }
}
