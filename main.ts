import type { Person } from './person';

const a = [1, 2, 3];
console.log(a.length);

class HalloAllerseits {
  constructor(private message: string) {}
}

new HalloAllerseits('hallo');

const _person = {
  id: 1,
  firstname: 'Anna',
  lastname: 'Gruber',
};
