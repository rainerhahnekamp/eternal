import { Component, Input } from '@angular/core';
import { createPipeFactory } from '@ngneat/spectator/jest';
import { Customer } from './customer';
import { CustomerPipe } from './customer.pipe';

describe('Customer Pipe', () => {
  const customer: Customer = {
    id: 1,
    firstname: 'Karl',
    name: 'Feiersberger',
    birthdate: '1991-01-20',
    country: 'AT'
  };

  @Component({
    template: '<p>{{ customer | customer}}</p>'
  })
  class CustomerPipeTestComponent {
    @Input() customer: Customer = customer;
  }

  const createPipe = createPipeFactory({
    pipe: CustomerPipe,
    host: CustomerPipeTestComponent
  });

  it("should print the user's name", () => {
    const spectator = createPipe();
    expect(spectator.element).toHaveText('Feiersberger, Karl');
  });

  it('should use - for no names', () => {
    const spectator = createPipe({
      hostProps: { customer: { ...customer, name: '', firstname: '' } }
    });
    expect(spectator.element).toHaveText('-');
  });

  it('should print the name without spaces and comma on no firstname', () => {
    const spectator = createPipe({
      hostProps: { customer: { ...customer, name: 'Huber', firstname: '' } }
    });
    expect(spectator.element).toHaveText('Huber');
  });

  it('should print the firstname without spaces and common on no name', () => {
    const spectator = createPipe({
      hostProps: { customer: { ...customer, name: '', firstname: 'Anja' } }
    });
    expect(spectator.element).toHaveText('Anja');
  });
});
