import { Component, inject, Input, OnInit, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sub-newsletter',
  template: '<a routerLink="/">Home</a>',
  imports: [RouterLink],
  standalone: true,
})
export class SubNewsletterComponent {}

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <mat-form-field>
        <mat-label>EMail</mat-label>
        <input data-testid="inp-email" formControlName="email" matInput />
        <mat-icon matSuffix>email</mat-icon>
        <mat-hint>Please enter your email</mat-hint>
      </mat-form-field>
      <br />
      <button
        disabled
        class="my-4"
        mat-raised-button
        data-testid="btn-subscribe"
      >
        Subscribe
      </button>
    </form>

    <p data-testid="p-message">{{ message() }}</p>
    <app-sub-newsletter />`,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    SubNewsletterComponent,
  ],
})
export class NewsletterComponent implements OnInit {
  message = signal('');
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });

  @Input() email = '';

  ngOnInit(): void {
    this.formGroup.setValue({ email: this.email });
  }

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
