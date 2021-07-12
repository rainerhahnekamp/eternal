import { parseAddress } from './parse-address';

describe('parse address', () => {
  it('should provide a parse method', () => {
    const address = parseAddress('Domgasse 5');
    expect(address).toEqual({ street: 'Domgasse', streetNumber: '5' });
  });

  it('should parse a German address format with city and zip', () => {
    const address = parseAddress('Domgasse 5, 1010 Wien');
    expect(address).toEqual({
      street: 'Domgasse',
      streetNumber: '5',
      city: 'Wien',
      zip: '1010'
    });
  });

  it('should parse cities with spaces', () => {
    const address = parseAddress('Domgasse 5, 2700 Wiener Neustadt');
    expect(address).toMatchObject({ city: 'Wiener Neustadt' });
  });
});
