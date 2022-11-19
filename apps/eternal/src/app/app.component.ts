import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  LoaderComponent,
  MessageComponent,
} from '@eternal/shared/ui-messaging';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'eternal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    LoaderComponent,
    MessageComponent,
    SidemenuComponent,
    HeaderComponent,
    RouterOutlet,
  ],
})
export class AppComponent {}
