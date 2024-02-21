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
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sub',
  template: `<a routerLink="/">Home</a>`,
  standalone: true,
  imports: [RouterLink],
})
export class SubComponent {}

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <p>
        <mat-form-field>
          <mat-label>EMail</mat-label>
          <input
            matInput
            data-testid="inp-email"
            formControlName="email"
            type="text"
          />
          <mat-icon matSuffix>email</mat-icon>
          <mat-hint>Please enter your address</mat-hint>
        </mat-form-field>
      </p>
      <button mat-raised-button data-testid="btn-subscribe">Subscribe</button>
    </form>

    <p data-testid="p-message">{{ message() }}</p>
    <app-sub /> `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    SubComponent,
  ],
})
export class NewsletterComponent {
  message = signal('');
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });
  newsletterService = inject(NewsletterService);

  // constructor(private route: ActivatedRoute) {
  //   this.route.paramMap.subscribe((paramMap) => {
  //     if (paramMap.has('email')) {
  //       this.formGroup.setValue({ email: paramMap.get('email') || '' });
  //     }
  //   });
  // }

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
