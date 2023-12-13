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
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newsletter-sub',
  template: `<a routerLink="/home">Home</a>`,
  imports: [RouterLink],
  standalone: true,
})
export class NewsletterSubComponent {}

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <app-newsletter-sub />
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <mat-form-field>
        <mat-label>EMail</mat-label>
        <input data-testid="inp-email" formControlName="email" matInput />
        <mat-icon matSuffix>location_on</mat-icon>
        <mat-hint>Please enter your address</mat-hint>
      </mat-form-field>
      <div>
        <button mat-raised-button data-testid="btn-subscribe">Subscribe</button>
      </div>
    </form>

    <p data-testid="p-message">{{ message() }}</p> `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NewsletterSubComponent,
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
