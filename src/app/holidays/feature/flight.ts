export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
}

let currentId = 1;

export function createFlight(flight: Partial<Flight> = {}): Flight {
  return {
    ...{
      id: currentId++,
      from: 'Wien',
      to: 'London',
      date: new Date().toISOString(),
      delayed: false,
    },
    ...flight,
  };
}
