import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RouterLink } from '@angular/router';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'eternal-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule, RouterLink]
})
export class SidemenuComponent {
  securityService = inject(SecurityService);
}
