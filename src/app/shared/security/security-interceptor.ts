import { HttpInterceptorFn } from '@angular/common/http';
import { KeycloakService } from './internal/keycloak-service';
import { inject } from '@angular/core';
import { ANONYMOUS_CONTEXT } from '../http/anonymous.context';

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  const token = keycloakService.profile?.token;

  if (!token) {
    return next(req);
  }

  if (req.context.has(ANONYMOUS_CONTEXT)) {
    return next(req);
  }

  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    }),
  );
};
