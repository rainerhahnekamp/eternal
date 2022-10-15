import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SecurityEffects } from './security.effects';
import { securityFeature } from './security.reducer';
import {AuthModule} from "@auth0/auth0-angular";

@NgModule({
  imports: [
    StoreModule.forFeature(securityFeature),
    EffectsModule.forFeature([SecurityEffects]),
    CommonModule,
    AuthModule.forRoot({
      domain: "dev-xbu2-fid.eu.auth0.com",
      clientId: "YgUoOMh2jc4CQuo8Ky9PS7npW3Q4ckX9"
    })
  ],
})
export class SecurityModule {}
