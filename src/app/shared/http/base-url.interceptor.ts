import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Configuration } from '../config/configuration';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(Configuration).baseUrl;
  if (!req.url.startsWith('/')) {
    return next(req);
  }
  return next(
    req.clone({
      url: `${baseUrl}${req.url}`,
      withCredentials: true,
    }),
  );
};
