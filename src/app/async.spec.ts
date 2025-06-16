describe('async tasks', () => {
  it('should add 1 + 1 via setTimeout', () => {
    let a = 1;
    setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    }, 1000);
  });

  it('should add 1 + 1', () => {
    let a = 1;
    Promise.resolve(1).then((value) => {
      a += value;
      expect(a).toBe(2);
    });
  });
});
