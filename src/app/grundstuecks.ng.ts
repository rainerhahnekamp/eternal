import { Component, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Grundstueck {
  id: number;
  flaeche: number;
  nummer: string;
  kgName: string;
  kgNummer: string;
}

// create four grundstuecke

// export class GrundstueckeService {
//   getGrundstuecke(kgName: string): Observable<Grundstueck[]> {
//     return scheduled([grundstuecke.filter((g) => g.kgName.startsWith(kgName))], asapScheduler);
//   }
// }

@Injectable({ providedIn: 'root' })
export class GrundstueckeService {
  httpClient = inject(HttpClient);

  getGrundstuecke(kgName: string): Observable<Grundstueck[]> {
    return this.httpClient
      .get<Grundstueck[]>('https://asf', { params: { kgName } })
      .pipe(map((grundstuecke) => grundstuecke.filter(g => g.kgName.startsWith(kgName))))
  }
}

@Component({
  selector: 'app-grundstuecke',
  template: `
    <h1>Grundstücke</h1>
    <form (ngSubmit)="search()" [formGroup]="formGroup">
      <mat-form-field>
        <mat-label>Kastralname</mat-label>
        <input data-testid="inp-email" formControlName="search" matInput />
        <mat-icon matSuffix>location_on</mat-icon>
        <mat-hint>Suche nach Kastralgemeinde</mat-hint>
      </mat-form-field>

      <button mat-raised-button>Suche</button>
    </form>
    <ul>
      @for (grundstueck of grundstuecke$ | async; track grundstueck.id) {
        <li data-testid="grundstueck">
          {{ grundstueck.kgName }} ({{ grundstueck.nummer }}):
          {{ grundstueck.flaeche }}
          m²
        </li>
      }
    </ul>
  `,
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    AsyncPipe,
    FormsModule,
  ],
})
export class Grundstuecke {
  grundstueckeService = inject(GrundstueckeService);
  formGroup = inject(NonNullableFormBuilder).group({
    search: [''],
  });

  searchTerm$ = new BehaviorSubject('');

  grundstuecke$ = this.searchTerm$.pipe(
    switchMap((term) => this.grundstueckeService.getGrundstuecke(term)),
  );

  search() {
    console.log(`search ${JSON.stringify(this.formGroup.getRawValue())}`);
    this.searchTerm$.next(this.formGroup.getRawValue().search);
  }
}
