import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sub',
  template: '<a routerLink="/">Home</a>',
  standalone: true,
  imports: [RouterLink],
})
export class AppSubComponent {
  router = inject(Router);
}

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <input data-testid="inp-email" formControlName="email" type="text" />
      <button data-testid="btn-subscribe">Subscribe</button>
    </form>

    <p data-testid="p-loading" *ngIf="loading()">Es lädt...</p>
    <p data-testid="p-message" *ngIf="!loading()">{{ message() }}</p>
    <app-sub /> `,
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AppSubComponent],
})
export class NewsletterComponent {
  message = signal('');
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });
  newsletterService = inject(NewsletterService);
  loading = signal(false);

  handleSubmit() {
    if (this.formGroup.valid) {
      this.loading.set(true);
      this.newsletterService
        .send(this.formGroup.getRawValue().email)
        .subscribe(() => {
          this.message.set('Thank you for your subscription');
          this.loading.set(false);
        });
    } else {
      this.message.set('Please provide an email');
    }
  }
}
