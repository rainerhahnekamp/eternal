import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SecurityService } from '@eternal/shared/security';
import { RouterLinkWithHref } from '@angular/router';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'eternal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatButtonModule, NgIf, AsyncPipe, RouterLinkWithHref, LetModule],
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
