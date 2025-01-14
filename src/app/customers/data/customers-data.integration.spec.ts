import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CustomersStore, provideCustomers } from '@app/customers/data';
import { provideRouter } from '@angular/router';
import { Configuration } from '@app/shared/config';
import { MatDialogModule } from '@angular/material/dialog';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { createCustomers } from '@app/customers/model';

describe('Customers Data', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        provideStore(),
        provideCustomers(),
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Configuration,
          useValue: new Configuration('https:///www.host.com'),
        },
      ],
    });

    const repository = TestBed.inject(CustomersStore);
    const httpCtrl = TestBed.inject(HttpTestingController);

    return { repository, httpCtrl };
  };

  it('should instantiate', () => {
    setup();
  });

  it('should load customers', async () => {
    const { repository, httpCtrl } = setup();
    const customers = createCustomers({}, {});

    repository.get(1);
    httpCtrl
      .expectOne('/customers?page=1')
      .flush({ content: customers, page: 1, total: 30 });
    const pagedCustomers = repository.pagedCustomers();

    expect(pagedCustomers).toEqual({
      customers: customers.map((customer) => ({
        ...customer,
        selected: false,
      })),
      page: 1,
      total: 30,
    });
  });

  it('should show an error', async () => {
    const { repository, httpCtrl } = setup();

    repository.get(-1);
    httpCtrl
      .expectOne('/customers?page=-1')
      .flush('', { status: 502, statusText: 'Bad Gateway' });
    const pagedCustomers = repository.pagedCustomers();

    expect(pagedCustomers).toEqual({
      customers: [],
      page: 0,
      total: 0,
    });
    expect(repository.hasError()).toBeTrue();
  });
});
