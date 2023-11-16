import { Action, Store } from '@ngrx/store';
import { customersFeature } from './customers.reducer';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CustomersEffects } from './customers.effects';
import { customersActions } from './customers.actions';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Configuration } from '@app/shared/config';
import { MessageService } from '@app/shared/ui-messaging';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { marbles } from 'rxjs-marbles/jasmine';
import { createCustomer } from '@app/customers/model';

describe('Customer Effects', () => {
  const setup = (actions$: Observable<Action>, httpClientMock?: unknown) => {
    const httpClient = (httpClientMock ??
      createSpyFromClass(HttpClient)) as Spy<HttpClient>;
    const store = createSpyFromClass(Store);
    const configuration = createSpyFromClass(Configuration);
    const router = createSpyFromClass(Router);
    const messageService = createSpyFromClass(MessageService);

    const effects = TestBed.configureTestingModule({
      providers: [
        CustomersEffects,
        {
          provide: Actions,
          useValue: actions$,
        },
        { provide: HttpClient, useValue: httpClient },
        { provide: Router, useValue: router },
        { provide: Store, useValue: store },
        { provide: Configuration, useValue: configuration },
        { provide: MessageService, useValue: messageService },
      ],
    }).inject(CustomersEffects);

    return {
      httpClient,
      store,
      configuration,
      router,
      messageService,
      effects,
    };
  };

  describe('init', () => {
    it('should dispatch get if not loaded', async () => {
      const actions$ = of(customersActions.init());
      const { effects, store } = setup(actions$);
      store.select.and.callFake((selector: unknown) => {
        expect(selector).toBe(customersFeature.selectIsLoaded);
        return of(false);
      });

      expect(await firstValueFrom(effects.init$)).toEqual(
        customersActions.get({ page: 1 }),
      );
    });

    it('should dispatch nothing if already loaded', async () => {
      const actions$ = of(customersActions.init());
      const { effects, store } = setup(actions$);
      store.select.and.callFake((selector: unknown) => {
        expect(selector).toBe(customersFeature.selectIsLoaded);
        return of(true);
      });

      await expectAsync(firstValueFrom(effects.init$)).toBeRejected();
    });
  });

  it(
    'should not load in parallel',
    marbles((m) => {
      const actions$ = m.cold('100ms a 100ms b 100ms c', {
        a: customersActions.load({ page: 1 }),
        b: customersActions.load({ page: 2 }),
        c: customersActions.load({ page: 3 }),
      });

      const customers = [
        createCustomer(),
        createCustomer(),
        createCustomer({ firstname: 'User 3' }),
      ];
      const [lastCustomer] = customers;
      const httpClientMock = {
        get: () =>
          m.cold('200ms r', {
            r: { content: [customers.pop()], total: 20 },
          }),
      };

      const { effects } = setup(actions$, httpClientMock);

      m.expect(effects.load$).toBeObservable('502ms b', {
        b: customersActions.loadSuccess({
          customers: [lastCustomer],
          total: 20,
          page: 3,
        }),
      });
    }),
  );

  it(
    'should dispatch loadFailure on error',
    marbles((m) => {
      const actions$ = m.cold('l', {
        l: customersActions.load({ page: 1 }),
      });
      const httpClient = { get: () => m.cold('#', {}, new Error()) };

      const { effects } = setup(actions$, httpClient);

      m.expect(effects.load$).toBeObservable('a', {
        a: customersActions.loadFailure(),
      });
    }),
  );

  describe('add$', () => {
    it('should redirect to /customers', () => {
      const actions$ = of(customersActions.add({ customer: createCustomer() }));
      const { effects, httpClient, router } = setup(actions$);
      httpClient.post.and.returnValue(of(true));

      effects.add$.subscribe();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/customers');
    });
  });
});
