import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { ChatService } from './chat.service';

@Component({
  selector: 'eternal-chat',
  template: ` <mat-list>
    <div mat-subheader>Messages</div>
    <mat-list-item *ngFor="let message of messages()">
      <mat-icon matListItemIcon>chat</mat-icon>
      <div matListItemTitle>{{ message.text }}</div>
      <div matListItemLine>{{ message.sent | date }}</div>
    </mat-list-item>
  </mat-list>`,
  imports: [MatListModule, MatIconModule, NgForOf, AsyncPipe, DatePipe, NgIf],
  standalone: true,
})
export class ChatComponent {
  messages = inject(ChatService).messages;
}
