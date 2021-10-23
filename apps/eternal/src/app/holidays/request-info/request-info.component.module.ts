import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestInfoComponent } from './request-info.component';

@NgModule({
  declarations: [RequestInfoComponent],
  exports: [RequestInfoComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RequestInfoComponentModule {}
