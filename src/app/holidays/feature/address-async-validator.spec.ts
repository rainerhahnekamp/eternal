import { TestBed, waitForAsync } from '@angular/core/testing';
import { AddressAsyncValidator } from '@app/holidays/feature/adress-async-validator';
import { AbstractControl } from '@angular/forms';
import { lastValueFrom, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';

describe('AddressAsyncValidator', () => {
  it('should validate an invalid address', waitForAsync(async () => {
    TestBed.configureTestingModule({
      providers: [
        AddressAsyncValidator,
        {
          provide: HttpClient,
          useValue: { get: () => of([]).pipe(delay(0)) },
        },
      ],
    });
    const validator = TestBed.inject(AddressAsyncValidator);
    const isValid = await lastValueFrom(
      validator.validate({ value: 'Domgasse 5' } as AbstractControl),
    );
    expect(isValid).toEqual({ address: 'invalid' });
  }));
});
