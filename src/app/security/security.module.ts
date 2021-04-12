import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { ActivateComponent } from './activate/activate.component';
import { BasicComponent } from './sign-up/basic/basic.component';
import { DetailComponent } from './sign-up/detail/detail.component';
import { InterestsComponent } from './sign-up/interests/interests.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TermsComponent } from './sign-up/terms/terms.component';
import { SignInComponent } from './signIn/sign-in.component';

@NgModule({
  declarations: [
    SignInComponent,
    BasicComponent,
    DetailComponent,
    InterestsComponent,
    TermsComponent,
    SignUpComponent,
    ActivateComponent
  ],
  imports: [
    CommonModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
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
