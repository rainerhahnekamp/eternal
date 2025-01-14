import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityService } from 'src/app/shared/security';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [AsyncPipe, MatButtonModule, RouterLink],
})
export class SidemenuComponent {
  securityService = inject(SecurityService);
}
