import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { ActivateComponent } from './activate.component';

@NgModule({
  declarations: [ActivateComponent],
  exports: [ActivateComponent],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule]
})
export class ActivateComponentModule {}
