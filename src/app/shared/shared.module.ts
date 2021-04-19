import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedEffects } from './+state/shared.effects';
import { reducer, sharedFeatureKey } from './+state/shared.reducer';
import { DontLeaveMeDirective } from './dont-leave-me.directive';

@NgModule({
  imports: [
    StoreModule.forFeature(sharedFeatureKey, reducer),
    EffectsModule.forFeature([SharedEffects])
  ],
  exports: [DontLeaveMeDirective],
  declarations: [DontLeaveMeDirective]
})
export class SharedModule {}
