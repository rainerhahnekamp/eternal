import { Component, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'eternal-newsletter',
  templateUrl: './newsletter.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NewsletterComponent implements OnInit {
  message = '';
  formGroup = this.fb.group({ email: ['', Validators.required] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.formGroup.valid) {
      this.message = 'Thank you for your subscription';
    } else {
      this.message = 'Please provide an email';
    }
  }
}
