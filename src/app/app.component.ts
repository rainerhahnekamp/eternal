import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './core/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuComponent } from './core/sidemenu/sidemenu.component';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/ui-messaging/loader/loader.component';
import { MessageComponent } from './shared/ui-messaging/message/message.component';
import { FooterComponent } from './core/footer.component';

@Component({
  selector: 'app-root',
  template: ` <div class="main flex">
    <mat-toolbar color="primary">
      <mat-toolbar-row class="flex justify-between">
        <app-header />
      </mat-toolbar-row>
    </mat-toolbar>
    <mat-drawer-container autosize>
      <mat-drawer mode="side" opened>
        <app-sidemenu />
      </mat-drawer>
      <mat-drawer-content class="p-4">
        <app-loader />
        <app-message />
        <router-outlet />
      </mat-drawer-content>
    </mat-drawer-container>
    <app-footer />
  </div>`,
  styleUrls: ['./app.component.scss'],
  imports: [
    HeaderComponent,
    LoaderComponent,
    SidemenuComponent,
    MatToolbarModule,
    MatSidenavModule,
    RouterOutlet,
    MessageComponent,
    FooterComponent,
  ],
})
export class AppComponent {}
