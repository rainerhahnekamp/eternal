import { Component, computed, effect, signal } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './core/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuComponent } from './core/sidemenu/sidemenu.component';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent, MessageComponent } from '@app/shared/ui-messaging';
import { FooterComponent } from '@app/core/footer.component';

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
        <router-outlet />
        <app-message />
      </mat-drawer-content>
    </mat-drawer-container>
    <app-footer />
  </div>`,
  styleUrls: ['./app.component.scss'],
  standalone: true,
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
