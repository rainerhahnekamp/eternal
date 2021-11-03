import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BasicComponent } from './basic.component';

@NgModule({
  declarations: [BasicComponent],
  imports: [MatRippleModule, CommonModule, MatIconModule],
  exports: [BasicComponent]
})
export class BasicComponentModule {}
