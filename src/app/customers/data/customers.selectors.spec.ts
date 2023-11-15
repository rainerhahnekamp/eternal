import { fromCustomers } from './customers.selectors';
import { createCustomer, createCustomers } from '@app/customers/model';

describe('Customers Selectors', () => {
  it('should select a customer by id', () => {
    const firstCustomer = createCustomer({ id: 1 });
    const customers = createCustomers(firstCustomer, createCustomer({ id: 2 }));
    expect(fromCustomers.selectById(1).projector(customers)).toEqual(
      firstCustomer,
    );
    expect(fromCustomers.selectById(3).projector(customers)).toBeUndefined();
  });
  it('should select selected customer', () => {
    const tanjaLudwig = createCustomer({
      id: 2,
      firstname: 'Tanja',
      name: 'Ludwig',
    });
    const customers = createCustomers(createCustomer({ id: 1 }), tanjaLudwig);
    expect(
      fromCustomers.selectSelectedCustomer.projector(customers, 2),
    ).toEqual(tanjaLudwig);
  });
});
