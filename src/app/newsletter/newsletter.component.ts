import { Component, inject, Input, OnChanges, signal } from "@angular/core";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { NewsletterService } from '@app/newsletter/newsletter.service';

import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sub-newsletter',
  template: `
    <a routerLink="/">Home</a>
    <a [href]="'mailto:' + email">Mail</a>
  `,
  standalone: true,
  imports: [RouterLink],
})
export class SubNewsletterComponent {
  @Input() email = ''
}


@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
  <app-sub-newsletter [email]="formGroup.getRawValue().email" />
  <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
    <mat-form-field>
      <mat-label>EMail</mat-label>
      <input data-testid="inp-email" formControlName="email" matInput />
      <mat-icon matSuffix>email</mat-icon>
      <mat-hint>Please enter your email</mat-hint>
    </mat-form-field>
    <br />
    <button mat-raised-button data-testid="btn-subscribe">Subscribe</button>
  </form>

  <p data-testid="p-message" *ngIf="message">{{ message }}</p> `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    SubNewsletterComponent,
  ],
})
export class NewsletterComponent {
  message = '';
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });
  newsletterService = inject(NewsletterService);

  handleSubmit() {
    if (this.formGroup.valid) {
      this.newsletterService
        .send(this.formGroup.getRawValue().email)
        .subscribe(() => (this.message = 'Thank you for your subscription'));
    } else {
      this.message = 'Please provide an email';
    }
  }
}
