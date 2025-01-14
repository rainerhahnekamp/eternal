import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityService } from 'src/app/shared/security';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, MatButtonModule, AsyncPipe],
})
export class HeaderComponent {
  #securityService = inject(SecurityService);
  user$ = this.#securityService.loadedUser$;

  signOut() {
    this.#securityService.signOut();
  }

  signIn() {
    this.#securityService.signIn();
  }
}
