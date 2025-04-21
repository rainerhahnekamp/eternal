import { TestBed } from '@angular/core/testing';
import { SewerLocator } from './sewer-locator.service';
import { HttpClient } from '@angular/common/http';
import {
  provideExperimentalZonelessChangeDetection,
  ResourceStatus,
} from '@angular/core';
import { of } from 'rxjs';

describe('Sewer Locator', () => {
  let clock: jasmine.Clock;

  beforeEach(() => {
    clock = jasmine.clock();
    clock.install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  it('should find sewers', async () => {
    expect(true).toBe(true);

    const httpClient = {
      post: jasmine.createSpy(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        provideExperimentalZonelessChangeDetection(),
      ],
    });
    const sewerLocator = TestBed.inject(SewerLocator);
    const { sewers } = sewerLocator;
    expect(sewers.status()).toBe(ResourceStatus.Idle);

    httpClient.post.and.returnValue(
      of({
        elements: [
          { lat: 46, lon: 16.5 },
          { lat: 47, lon: 17 },
        ],
      }),
    );
    void sewerLocator.setLocation(46, 16);

    // Could be shortened to await Promise.resolve()
    const promise = new Promise((resolve) => setTimeout(resolve, 0));
    clock.tick(0);
    await promise;

    expect(sewers.value()).toEqual({
      current: { lat: 46, lon: 16 },
      minDistance: 38664,
      nearest: { lat: 46, lon: 16.5 },
      sewers: [
        { lat: 46, lon: 16.5 },
        { lat: 47, lon: 17 },
      ],
    });
  });
});
