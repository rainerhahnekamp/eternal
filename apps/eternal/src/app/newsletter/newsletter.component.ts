import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'eternal-newsletter',
  templateUrl: './newsletter.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NewsletterComponent {
  message = '';
  formGroup = inject(NonNullableFormBuilder).group({ email: ['', Validators.required] });

  handleSubmit() {
    if (this.formGroup.valid) {
      this.message = 'Thank you for your subscription';
    } else {
      this.message = 'Please provide an email';
    }
  }
}
