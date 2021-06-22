import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
  formGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    formly.requiredText('email', 'EMail'),
    formly.requiredText('password', 'Password', { type: 'password' })
  ];
  signedIn$ = this.userService.signedIn$;

  constructor(private userService: UserService) {}

  handleSubmit() {
    if (this.formGroup.valid) {
      const { email, password } = this.formGroup.value;
      this.userService.signIn(email, password);
    }
  }
}
