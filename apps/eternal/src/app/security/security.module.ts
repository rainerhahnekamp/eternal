import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
    ])
  ]
})
export class SecurityModule {}
