import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SewerLocator } from './sewer-locator.service';
import { HttpClient } from '@angular/common/http';
import {
  provideExperimentalZonelessChangeDetection,
  ResourceStatus,
} from '@angular/core';
import { of } from 'rxjs';

fit('should find sewers', fakeAsync(() => {
  const httpClientMock = {
    post: jasmine.createSpy(),
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: httpClientMock },
      provideExperimentalZonelessChangeDetection(),
    ],
  });
  const sewerLocator = TestBed.inject(SewerLocator);

  expect(sewerLocator.status()).toBe(ResourceStatus.Idle);

  httpClientMock.post.and.returnValue(
    of({
      elements: [
        { lat: 46, lon: 16.5 },
        {
          lat: 47,
          lon: 17,
        },
      ],
    }),
  );
  sewerLocator.setLocation(46, 16);
  tick();

  expect(sewerLocator.value()).toEqual({
    current: { lat: 46, lon: 16 },
    minDistance: 38664,
    nearest: { lat: 46, lon: 16.5 },
    sewers: [
      { lat: 46, lon: 16.5 },
      { lat: 47, lon: 17 },
    ],
  });
}));
