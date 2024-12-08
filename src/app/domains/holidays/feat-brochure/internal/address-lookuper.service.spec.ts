import { AddressLookuper } from './address-lookuper.service';

describe('Address Lookuper', () => {
  it('should pass addresses in the constructor', () => {
    const addresses = ['Domgasse 5, 1010 Wien'];
    const lookuper = new AddressLookuper(() => addresses);

    expect(lookuper.lookup('Domgasse 15, 1010 Wien')).toBe(false);
    expect(lookuper.lookup('Domgasse 5, 1010 Wien')).toBe(true);
  });

  it('should count the queries', () => {
    const lookuper = new AddressLookuper(() => []);
    expect(lookuper.counter).toBe(0);
    lookuper.lookup('Domgasse 5');
    expect(lookuper.counter).toBe(1);
  });
});
