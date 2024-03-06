import {
  AfterViewInit,
  Component,
  computed,
  ContentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  NgZone,
  signal,
  untracked,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService } from '@app/flight-search/flight.service';
import { Flight } from '@app/flights/flight';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { addMinutes } from 'date-fns';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { debounceTime, interval, Observable, of, pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { FlightStore } from '@app/flight-search/flight-store';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    MatInputModule,
    MatIconModule,
    MatButton,
  ],
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  protected flightService = inject(FlightService);
  protected readonly flightStore = inject(FlightStore);

  flights = this.flightStore.flights;

  ngForm = viewChild.required(NgForm);
  destroyRef = inject(DestroyRef);

  constructor() {
    const numbers$ = of(1, 2, 3, 4);
    const number = signal(1);

    const incrementer = rxMethod<number>(
      pipe(
        tap((value) => console.log(value)),
        debounceTime(200),
        tap(console.log),
      ),
    );
    number.set(2);

    incrementer(numbers$);
    // incrementer(number);

    incrementer(signal(10));

    effect(() => {
      const ngForm = this.ngForm();

      untracked(() => {
        ngForm.valueChanges
          ?.pipe(tap(console.log))
          .subscribe(({ from, to }) => this.flightStore.search({ from, to }));
      });
    });
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

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
