describe('Inital Tests', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });

  it('should do basic checks', () => {
    expect(true).not.toBe(false);
    expect(true).toBeTruthy();
    expect({}).toBeTruthy();
    expect('').toBeFalsy();
    expect('').toBeDefined();
    expect(null).toBeNull();
    expect(null).toBeDefined();
  });

  it('should do type specific checks', () => {
    // string & number
    expect('hallo').toMatch(/l/);
    expect(5).toBeGreaterThan(2);
    expect(0.2 + 0.1).toBeCloseTo(0.3);

    // arrays
    expect([]).toHaveLength(0);
    expect([1, 2, 3]).toContain(1);

    // types
    expect(new Date()).toBeInstanceOf(Date);
    class A {}
    expect(new A()).toBeInstanceOf(A);
    expect(() => true).toBeInstanceOf(Function);
  });

  it('should check for exceptions', () => {
    // exceptions
    const fn = () => {
      throw new Error('nothing works');
    };
    expect(fn).toThrowError();
    expect(fn).toThrowError('nothing works');
  });

  it('should test object equalities', () => {
    const address = {
      street: 'Domgasse',
      streetNumber: '5',
      zip: '1010',
      city: 'Vienna',
    };
    const clone = { ...address };

    expect(address).not.toBe(clone);
    expect(address).toEqual(clone);
    expect(address).toMatchObject({ street: 'Domgasse', city: 'Vienna' });
  });
});
