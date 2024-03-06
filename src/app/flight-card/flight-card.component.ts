import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  model,
  NgZone,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Flight } from '@app/flights/flight';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCard, MatCardContent],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCardComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private dialog = inject(MatDialog);

  flight = input.required<Flight>();

  prettyFlight = computed(() => {
    const item = this.flight();
    if (item === undefined) {
      return '';
    }

    return `${item.from} - ${item.to}`;
  });

  selected = model.required<boolean>();

  select() {
    this.selected.set(true);
  }

  deselect() {
    this.selected.set(false);
  }

  edit() {}

  blink() {
    // Dirty Hack used to visualize the change detector
    this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  }
}
