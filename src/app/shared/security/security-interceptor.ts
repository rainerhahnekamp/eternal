import { HttpInterceptorFn } from '@angular/common/http';
import { KeycloakService } from '@app/shared/security/keycloak-service';
import { inject } from '@angular/core';

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  const token = keycloakService.profile?.token;

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer: ${token}`),
    }),
  );
};
