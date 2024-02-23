import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityService } from '@app/security';
import { ChatService } from '@app/chat/chat.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule, RouterLink, MatBadgeModule],
})
export class SidemenuComponent {
  securityService = inject(SecurityService);
  chatService = inject(ChatService);
}
