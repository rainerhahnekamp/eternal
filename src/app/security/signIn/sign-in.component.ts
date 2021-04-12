import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  formGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    formly.requiredText('email', 'EMail'),
    formly.requiredText('password', 'Password', { type: 'password' })
  ];
  signedIn$: Observable<boolean>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.signedIn$ = this.userService.signedIn$.pipe(tap(console.log));
  }

  handleSubmit() {
    if (this.formGroup.valid) {
      const { email, password } = this.formGroup.value;
      this.userService.signIn(email, password);
    }
  }
}
