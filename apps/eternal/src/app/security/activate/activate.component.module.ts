import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { ActivateComponent } from './activate.component';

@NgModule({
  declarations: [ActivateComponent],
  exports: [ActivateComponent],
  imports: [ReactiveFormsModule, FormlyModule]
})
export class ActivateComponentModule {}
