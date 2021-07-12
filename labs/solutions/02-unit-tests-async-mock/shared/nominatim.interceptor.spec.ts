import { HttpHandler, HttpRequest } from '@angular/common/http';
import { mock } from './mock';
import { NominatimInterceptor } from './nominatim.interceptor';

describe('NominatimService', () => {
  it('should add the header', () => {
    const req = new HttpRequest('GET', 'https://nominatim.openstreetmap.org/search');
    const next = {
      handle: jest.fn<void, [HttpRequest<unknown>]>()
    };

    new NominatimInterceptor().intercept(req, mock<HttpHandler>(next));
    const clonedReq = next.handle.mock.calls[0][0];
    expect(clonedReq.headers.get('NominatimId')).toBe('0129');
  });

  it('should not add the header', () => {
    const req = new HttpRequest('GET', 'https://maps.google.com/search');
    const next = {
      handle: jest.fn<void, [HttpRequest<unknown>]>()
    };

    new NominatimInterceptor().intercept(req, mock<HttpHandler>(next));
    const clonedReq = next.handle.mock.calls[0][0];
    expect(clonedReq.headers.has('NominatimId')).toBe(false);
  });
});
