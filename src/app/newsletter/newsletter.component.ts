import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sub',
  template: `<a routerLink="/">Home</a>`,
  imports: [RouterLink],
  standalone: true,
})
export class SubComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
}

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <input data-testid="inp-email" formControlName="email" type="text" />
      <button data-testid="btn-subscribe">Subscribe</button>
    </form>

    <p data-testid="p-message">{{ message() }}</p>
    <app-sub /> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SubComponent],
})
export class NewsletterComponent {
  message = signal('');
  newsletterService = inject(NewsletterService);
  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });

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
