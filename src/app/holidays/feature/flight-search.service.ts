import { Injectable } from '@angular/core';
import { createFlight, Flight } from '@app/holidays/feature/flight';
import { add } from 'date-fns';

const flights = [
  createFlight({ date: new Date().toISOString() }),
  createFlight({ date: add(new Date(), { days: 1 }).toISOString() }),
  createFlight({ date: add(new Date(), { days: 2 }).toISOString() }),
  createFlight({ date: add(new Date(), { days: 3 }).toISOString() }),
  createFlight({ date: add(new Date(), { days: 4 }).toISOString() }),
  createFlight({ date: add(new Date(), { days: 5 }).toISOString() }),
];

@Injectable({ providedIn: 'root' })
export class FlightSearch {
  search(): Promise<Flight[]> {
    return Promise.resolve(flights);
  }
}
