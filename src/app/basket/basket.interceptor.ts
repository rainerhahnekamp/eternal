import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest, HttpResponse
} from "@angular/common/http";
import { Observable, of } from 'rxjs';

export const basketInterceptor: HttpInterceptorFn = (req, handle) => {
  if (req.url.startsWith('/basket')) {
    console.group("Basket Request");
    console.log("Request URL: ", req.url);
    console.log("Request Body %o", req.body);
    console.groupEnd();
    return of(new HttpResponse({ body: null }));
  }
  return handle(req);
};
