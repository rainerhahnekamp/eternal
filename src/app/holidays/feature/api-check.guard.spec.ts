import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { lastValueFrom, Observable, of } from 'rxjs';
import { apiCheckGuard } from './api-check.guard';

describe('Api Check Guard', () => {
  it('should return true', waitForAsync(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: { get: () => of(true).pipe(delay(1)) },
        },
      ],
    });

    let value$: Observable<boolean> = of();

    await TestBed.runInInjectionContext(async () => {
      value$ = apiCheckGuard();
      expect(await lastValueFrom(value$)).toBe(true);
    });
  }));
});
