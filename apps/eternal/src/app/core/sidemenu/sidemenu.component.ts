import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLinkWithHref } from '@angular/router';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'eternal-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule, RouterLinkWithHref]
})
export class SidemenuComponent {
  securityService = inject(SecurityService);
}
