import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityStore } from 'src/app/shared/security';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [RouterLink, MatButtonModule]
})
export class HeaderComponent {
  #securityStore = inject(SecurityStore);
  user = this.#securityStore.loadedUser;

  signOut() {
    this.#securityStore.signOut();
  }

  signIn() {
    this.#securityStore.signIn();
  }
}
