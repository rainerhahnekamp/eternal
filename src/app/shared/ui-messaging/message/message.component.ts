import { animate, style, transition, trigger } from '@angular/animations';
import { Component, effect, inject } from '@angular/core';
import { MessageStore } from './message.store';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styles: [
    `
      .error {
        background: #f44336;
        color: white;
      }

      .info {
        background: #2193b0;
        color: white;
      }
    `,
  ],
  imports: [MatIconModule, NgClass],
  animations: [
    trigger('myTrigger', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class MessageComponent {
  flag = true;
  state = 'fadeInFlash';

  protected readonly messageStore = inject(MessageStore);

  constructor() {
    effect(
      () => {
        const messages = this.messageStore.messages();
        setTimeout(() => {
          for (const message of messages) {
            this.messageStore.remove(message);
          }
        }, 3000);
      },
      { debugName: 'messageCleanup' },
    );
  }
}
