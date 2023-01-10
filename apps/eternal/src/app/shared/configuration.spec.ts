import { Configuration } from './configuration';
import { expect } from '@jest/globals';

describe('Configuration', () => {
  it('should instantiate correctly', () => {
    const config = new Configuration('somewhere', false, true, true);
    expect(config.features).toEqual({ mockCustomers: false, mockHolidays: true, useTestid: true });
  });

  test('partial update should also allow a false', () => {
    const config = new Configuration('somewhere', true, true, true);
    config.updateFeatures({ mockCustomers: false, mockHolidays: false, useTestid: false });
    expect(config.features).toEqual({
      mockHolidays: false,
      mockCustomers: false,
      useTestid: false
    });
  });
});
