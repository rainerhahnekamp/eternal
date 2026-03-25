import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Header } from './core/header/header';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Sidemenu } from './core/sidemenu/sidemenu';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/ui-messaging/loader/loader.component';
import { MessageComponent } from './shared/ui-messaging/message/message.component';
import { Footer } from './core/footer';

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
  styles: `
    div.main {
      max-width: 1280px;
      margin: 0 auto;
      flex-direction: column;
      justify-content: stretch;

      mat-drawer-container {
        flex: 1 1 auto;
        min-height: 25em;

        mat-drawer {
          background: #fafafa;
        }
      }
    }
  `,
  imports: [
    Header,
    LoaderComponent,
    Sidemenu,
    MatToolbarModule,
    MatSidenavModule,
    RouterOutlet,
    MessageComponent,
    Footer,
  ],
})
export class App {}
