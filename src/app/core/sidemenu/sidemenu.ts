import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { SecurityStore } from '../../shared/security/security-store';
import { ChatClient } from '../../chat/chat-client';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.html',
  styleUrls: ['./sidemenu.scss'],
  imports: [MatButtonModule, RouterLink, MatBadgeModule],
})
export class Sidemenu {
  securityStore = inject(SecurityStore);
  chatService = inject(ChatClient);
}
