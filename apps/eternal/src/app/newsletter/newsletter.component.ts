import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NewsletterService } from './newsletter.service';

@Component({
  selector: 'eternal-newsletter',
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent implements OnInit {
  message = '';
  formGroup = this.fb.group({ email: ['', Validators.required], name: [] });

  constructor(private fb: FormBuilder, private newsletterService: NewsletterService) {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.formGroup.valid) {
      this.newsletterService.send(this.formGroup.value.email).subscribe(() => {
        this.message = 'Thank you for your subscription';
      });
    } else {
      this.message = 'Please provide an email';
    }
  }
}
