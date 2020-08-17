import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address/address.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: 'testing', component: AddressComponent }]),
    ReactiveFormsModule
  ],
  declarations: [AddressComponent]
})
export class TestingModule {}
