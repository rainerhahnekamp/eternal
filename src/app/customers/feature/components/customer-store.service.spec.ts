import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { Injectable } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CustomerService } from '@app/customers/data';
import { CustomerStore } from '@app/customers/feature/components/customer-store.service';
import { createCustomer } from '@app/customers/model';

@Injectable({ providedIn: 'root' })
export class CounterService {
  changeCounter = 0;
  n = signal(1);
  double = computed(() => this.n() * 2);

  counterEffect = effect(() => {
    this.n();
    this.changeCounter++;
  });
}

@Component({
  template: ``,
  standalone: true,
  providers: [CustomerStore],
})
export class WrapperComponent {
  id = input.required<number>();

  constructor() {
    this.customerStore.loadCustomer(this.id)
  }

  customerStore = inject(CustomerStore);
  customerName = this.customerStore.fullName
}

describe('Customer Store', () => {
  it('should work', () => {
    const counterService = TestBed.inject(CounterService);

    TestBed.flushEffects();
    expect(counterService.changeCounter).toBe(1);

    TestBed.flushEffects();
    expect(counterService.changeCounter).toBe(1);

    counterService.n.set(2);
    TestBed.flushEffects();
    expect(counterService.changeCounter).toBe(2);
  });

  it('should test the CustomerService', fakeAsync(() => {
    const customer = createCustomer({ id: 1, name: 'Doe', firstname: 'John' });
    const customerService = {
      byId() {
        return Promise.resolve(customer);
      },
    };

    const id = signal(1);

    const store = TestBed.configureTestingModule({
      providers: [
        CustomerStore,
        { provide: CustomerService, useValue: customerService },
      ],
    }).inject(CustomerStore);

    TestBed.runInInjectionContext(() => store.loadCustomer(id));
    tick();
    TestBed.flushEffects();

    expect(store.fullName()).toBe('John Doe');
  }))

  it('should test the CustomerService with a component', async () => {
    const customer = createCustomer({ id: 1, name: 'Doe', firstname: 'John' });
    const customerService = {
      byId() {
        return Promise.resolve(customer);
      },
    };

    const fixture = TestBed.configureTestingModule({
      imports: [WrapperComponent],
      providers: [
        { provide: CustomerService, useValue: customerService },
      ],
    }).createComponent(WrapperComponent)

    fixture.componentRef.setInput('id', 1)
    fixture.autoDetectChanges(true)
    await fixture.whenStable()

    expect(fixture.componentRef.instance.customerName()).toBe('John Doe');
  });
});
