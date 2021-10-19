import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedEffects } from './+state/shared.effects';
import { sharedFeature } from './+state/shared.reducer';

@NgModule({
  imports: [StoreModule.forFeature(sharedFeature), EffectsModule.forFeature([SharedEffects])]
})
export class SharedModule {}
