import { TestBed } from '@angular/core/testing';
import { TestService } from './service';

describe('Signals', () => {
  it('should test the message signal', () => {
    const service = TestBed.inject(TestService);

    expect(service.message()).toBe('Form is invalid');
    service.formGroup.setValue({ email: 'user@host.com' });
    service.handleSubmit();
    expect(service.message()).toBe('Form is valid');
  });

  it('should test the counter', () => {
    const service = TestBed.inject(TestService);
    expect(service.counter()).toBe(0);
    service.increment();

    TestBed.flushEffects();
    expect(service.counter()).toBe(1);

    service.increment(1);
    service.increment(2);
    service.increment(3);
    service.increment(4);
    service.increment(5);
    TestBed.flushEffects();
    expect(service.counter()).toBe(6);
  });
});
