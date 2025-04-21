import { TestBed } from '@angular/core/testing';
import { SewerLocator } from './sewer-locator.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideExperimentalZonelessChangeDetection,
  ResourceStatus,
} from '@angular/core';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('Sewer Locator', () => {
  it('should find sewers', async () => {
    expect(true).toBe(true);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideExperimentalZonelessChangeDetection(),
      ],
    });
    const sewerLocator = TestBed.inject(SewerLocator);
    const ctrl = TestBed.inject(HttpTestingController);
    const { sewers } = sewerLocator;
    expect(sewers.status()).toBe(ResourceStatus.Idle);
    void sewerLocator.setLocation(46, 16);
    TestBed.flushEffects();
    ctrl.expectOne('https://overpass-api.de/api/interpreter').flush({
      elements: [
        { lat: 46, lon: 16.5 },
        { lat: 47, lon: 17 },
      ],
    });
    await Promise.resolve();

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
