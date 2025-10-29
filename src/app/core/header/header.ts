import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityStore } from '../../shared/security/security-store';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  imports: [RouterLink, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly #securityStore = inject(SecurityStore);
  protected readonly user = this.#securityStore.loadedUser;

  protected signOut() {
    this.#securityStore.signOut();
  }

  protected signIn() {
    this.#securityStore.signIn();
  }
}
