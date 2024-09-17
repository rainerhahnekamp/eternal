import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { HeartbeatService } from '../heartbeat.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="p-2 background-color-toolbar">
      @if (isHydrated()) {
        <div
          class="text-xs flex items-center justify-end gap-2"
          data-testid="hydrated"
        >
          <span>Application is ready</span>
          @if (apiReachable() === 'connected') {
            <mat-icon>wifi</mat-icon>
          } @else {
            <mat-icon class="text-red-500">wifi_off</mat-icon>
          }
        </div>
      }
    </footer>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FooterComponent {
  readonly isHydrated = signal(false);
  readonly apiReachable = inject(HeartbeatService).status;

  constructor() {
    afterNextRender(() => this.isHydrated.set(true));
  }
}
