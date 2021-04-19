import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';

@NgModule({
  declarations: [HeaderComponent, SidemenuComponent, LoaderComponent],
  exports: [HeaderComponent, SidemenuComponent, LoaderComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, MatProgressBarModule]
})
export class CoreModule {}
