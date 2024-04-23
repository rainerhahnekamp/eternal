import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { SubComponent } from "@app/newsletter/sub.component";

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
  <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
    <mat-form-field>
      <mat-label>E-Mail</mat-label>
      <input data-testid="inp-email" formControlName="email" matInput />
      <mat-icon matSuffix>email</mat-icon>
      <mat-hint>Please enter your email</mat-hint>
    </mat-form-field>
    <button mat-raised-button class="ml-4" data-testid="btn-subscribe">
      Subscribe
    </button>
  </form>

  <p data-testid="p-message" *ngIf="message()"
     aria-live="assertive"
     role="status">{{ message() }}</p>
  <app-sub-newsletter />
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    SubComponent,
  ],
})
export class NewsletterComponent {
  message = signal('');
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });
  newsletterService = inject(NewsletterService);

  handleSubmit() {
    if (this.formGroup.valid) {
      this.newsletterService
        .send(this.formGroup.getRawValue().email)
        .subscribe(() => this.message.set('Thank you for your subscription'));
    } else {
      this.message.set('Please provide an email');
    }
  }
}
