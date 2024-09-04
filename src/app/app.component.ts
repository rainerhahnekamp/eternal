import { afterNextRender, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './core/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuComponent } from './core/sidemenu/sidemenu.component';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent, MessageComponent } from '@app/shared/ui-messaging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
  ],
})
export class AppComponent {
  isHydrated = false;

  constructor() {
    afterNextRender(() => {
      window.setTimeout(() => {
        this.isHydrated = true;
      });
    });
  }
}
