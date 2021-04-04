import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {concatMap, map, switchMap, tap} from "rxjs/operators";
import {BASE_URL} from "../../shared/base-url.token";
import {Customer} from "../customer";
import {CustomerActions} from "./customer.actions";

@Injectable()
export class CustomerEffects {
  private url = `${this.baseUrl}/customer`;
  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.add),
      concatMap(({customer}) => this.http.post<Customer[]>(this.url, customer)),
      map((customers) => CustomerActions.added({customers})),
      tap(() => this.router.navigateByUrl("/customer"))
    )
  );
  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.update),
      concatMap(({customer}) => this.http.put<Customer[]>(this.url, customer)),
      map((customers) => CustomerActions.updated({customers})),
      tap(() => this.router.navigateByUrl("/customer"))
    )
  );
  removeCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.remove),
      concatMap(({customer}) => this.http.delete<Customer[]>(`${this.url}/${customer.id}`)),
      map((customers) => CustomerActions.removed({customers})),
      tap(() => this.router.navigateByUrl("/customer"))
    )
  );
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.load),
      switchMap(() => this.http.get<Customer[]>(this.url)),
      map((customers) => CustomerActions.loaded({customers}))
    ));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, @Inject(BASE_URL) private baseUrl: string) {
  }
}
