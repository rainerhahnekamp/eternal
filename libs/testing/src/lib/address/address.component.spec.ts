import { AddressComponent } from './address.component';

describe('Test Address input', () => {
  it('should check for fields input and output', () => {
    const lookupFn = (street: string, streetNumber: string) => {
      if (street === 'Jameson Street' && streetNumber === '5') {
        return true;
      } else {
        return null;
      }
    };

    const lookup = { lookup: lookupFn };
    const component = new AddressComponent(lookup);
    component.street = 'Jameson Street';
    component.streetNumber = '5';
    component.search();

    expect(component.search()).toBeTruthy();
  });
});
