import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent {
  formGroup = new FormGroup({});
  model = { terms: false, gdpr: false };
  fields: FormlyFieldConfig[] = [formly.requiredNumber('activationCode', 'Activation Code')];
  message = '';

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}

  handleSubmit() {
    if (this.formGroup.valid) {
      this.httpClient
        .post(
          `/security/activate-user-by-code/${this.route.snapshot.paramMap.get('id')}/${
            this.formGroup.value.activationCode
          }`,
          {}
        )
        .subscribe((response) => {
          this.message = 'Activation successful. Please sign-in!';
        });
    }
  }
}
