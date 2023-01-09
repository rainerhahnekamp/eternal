import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'eternal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, MatButtonModule, AsyncPipe, NgIf]
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
