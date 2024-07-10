import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NewsletterService } from '@app/newsletter/newsletter.service';

import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-link',
  template: `<a routerLink="/">Home</a>`,
  standalone: true,
  imports: [RouterLink],
})
export class HomeLinkComponent {}


@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    AsyncPipe,
    HomeLinkComponent,
  ],
  template: `<h2>Newsletter</h2>
  <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
    <mat-form-field>
      <mat-label>EMail</mat-label>
      <input data-testid="inp-email" formControlName="email" matInput />
      <mat-icon matSuffix>email</mat-icon>
    </mat-form-field>
    <br />
    <button mat-raised-button data-testid="btn-subscribe">Subscribe</button>
  </form>

  <p data-testid="p-message">{{ message() }}</p>
  <app-home-link />
  `,
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
        .subscribe(() => {
          this.message.set('Thank you for your subscription');
        });
    } else {
      this.message.set('Please provide an email');
    }
  }
}
