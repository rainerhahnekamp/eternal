import { signalState } from '@ngrx/signals';

type Country = {
  id: number;
  name: string;
};

const initialState = {
  user: {
    firstName: 'John',
    lastName: 'Smith',
  },
  foo: 'bar',
  numbers: [1, 2, 3],
  ngrx: 'signals',
};

const country = {
  id: '1',
  name: 'Vienna',
};

const signal = signalState(country);

const firstname = signal.user.firstName;
