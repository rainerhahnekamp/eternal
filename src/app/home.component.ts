import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Configuration } from './shared/config/configuration';
import { SpecialGreetingComponent } from './core/special-greeting.component';
import { ChatService } from './chat/chat.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  template: `<h2 data-testid="greeting">Welcome to Eternal</h2>
    <div class="m-4">
      <button (click)="toggleClicked()" mat-raised-button>
        {{ buttonLabel() }}
      </button>
    </div>
    <app-special-greeting />
    <p data-testid="txt-greeting-1">
      Eternal is an imaginary travel agency and is used as training application
      for Angular developers.
    </p>
    <p data-testid="txt-greeting-2">
      You can click around, do whatever you want but don't expect to be able to
      book a real holiday 😉.
    </p>
    <h3 class="mt-8 text-l font-bold">Settings</h3>
    <form [formGroup]="formGroup" class="flex flex-col gap-y-5">
      <mat-slide-toggle
        formControlName="mockCustomers"
        data-testid="tgl-mock-customers"
        >Mock Customers
      </mat-slide-toggle>
      <mat-slide-toggle
        formControlName="mockHolidays"
        data-testid="tgl-mock-holidays"
        >Mock Holidays
      </mat-slide-toggle>
      <mat-slide-toggle
        formControlName="pagedCustomers"
        data-testid="tgl-paged-customers"
        >Paged Customers
      </mat-slide-toggle>
      <mat-slide-toggle
        formControlName="runHeartbeat"
        data-testid="tgl-run-heartbeat"
        >Heartbeat
      </mat-slide-toggle>
    </form>
    <div class="w-72">
      <button class="my-4" mat-raised-button (click)="enableWebsocket()">
        Enable Chat
      </button>

      @switch (chatService.status()) {
        @case ('failed') {
          <p
            class="border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700"
          >
            Could not establish connection
          </p>
        }
        @case ('connected') {
          <p
            class="border border-green-400 rounded bg-green-100 px-4 py-3 text-green-700"
          >
            Connection established
          </p>
        }
      }
    </div> `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    SpecialGreetingComponent,
    MatIcon,
  ],
})
export class HomeComponent implements OnInit {
  protected readonly config = inject(Configuration);
  protected readonly formGroup = inject(NonNullableFormBuilder).group({
    mockCustomers: [true],
    mockHolidays: [true],
    pagedCustomers: [true],
    runHeartbeat: [true],
  });
  protected readonly chatService = inject(ChatService);

  mockCustomers = new FormControl(true, {
    nonNullable: true,
  });

  mockHolidays = new FormControl(true, {
    nonNullable: true,
  });

  runHeartbeat = new FormControl(true, { nonNullable: true });

  clicked = signal(false);
  buttonLabel = computed(() => (this.clicked() ? 'Unclick me' : 'Click me'));

  toggleClicked() {
    this.clicked.update((value) => !value);
  }

  ngOnInit(): void {
    this.formGroup.setValue({
      mockCustomers: this.config.mockCustomers,
      mockHolidays: this.config.mockHolidays,
      pagedCustomers: this.config.pagedCustomers,
      runHeartbeat: this.config.runHeartbeat(),
    });
    this.formGroup.valueChanges.subscribe(() =>
      this.config.updateFeatures(this.formGroup.getRawValue()),
    );
  }

  enableWebsocket() {
    this.chatService.connect();
  }
}
