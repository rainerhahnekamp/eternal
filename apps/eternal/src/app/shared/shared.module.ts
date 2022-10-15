import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { sharedFeature } from './+state/shared.reducer';

@NgModule({
  imports: [StoreModule.forFeature(sharedFeature)]
})
export class SharedModule {}
