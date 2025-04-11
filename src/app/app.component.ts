import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <div class="m-auto max-w-lg">
    <router-outlet />
  </div>`,
  styleUrls: ['./app.component.scss'],
  imports: [MatToolbarModule, MatSidenavModule, RouterOutlet],
})
export class AppComponent {}
