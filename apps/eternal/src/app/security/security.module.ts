import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { ActivateComponent } from './activate/activate.component';
import { ActivateComponentModule } from './activate/activate.component.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpComponentModule } from './sign-up/sign-up.component.module';
import { SignInComponent } from './signIn/sign-in.component';
import { SignInComponentModule } from './signIn/sign-in.component.module';

@NgModule({
  imports: [
    ActivateComponentModule,
    SignInComponentModule,
    SignUpComponentModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: 'sign-in', component: SignInComponent },
          { path: 'sign-up', component: SignUpComponent },
          { path: 'activate/:id', component: ActivateComponent }
        ]
      }
    ]),
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatDatepickerModule,
    MatRippleModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class SecurityModule {}
