import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityStore } from 'src/app/shared/security';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule, RouterLink],
})
export class SidemenuComponent {
  securityStore = inject(SecurityStore);
}
