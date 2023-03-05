import { Configuration } from './configuration';
import { expect } from '@jest/globals';

describe('Configuration', () => {
  it('should instantiate correctly', () => {
    const config = new Configuration('somewhere', false, true);
    expect(config.features).toEqual({ mockCustomers: false, mockHolidays: true });
  });

  test('partial update should also allow a false', () => {
    const config = new Configuration('somewhere', true, true);
    config.updateFeatures({ mockCustomers: false, mockHolidays: false });
    expect(config.features).toEqual({
      mockHolidays: false,
      mockCustomers: false
    });
  });
});
