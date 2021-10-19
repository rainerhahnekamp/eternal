import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TermsComponentModule } from '../activate/terms.component';
import { BasicComponentModule } from './basic/basic.component.module';
import { DetailComponentModule } from './detail.component';
import { InterestsComponentModule } from './interests.component';
import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    MatStepperModule,
    MatButtonModule,
    BasicComponentModule,
    DetailComponentModule,
    TermsComponentModule,
    InterestsComponentModule
  ],
  exports: [SignUpComponent]
})
export class SignUpComponentModule {}
