import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

@Component({
  selector: 'eternal-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class RequestInfoComponent implements OnInit {
  @Input() address = '';

  formGroup = inject(NonNullableFormBuilder).group({
    address: ['', Validators.required]
  });

  lookuper = {
    lookup(query: string) {
      return of(true);
    }
  };

  title = 'Request More Information';
  submitter$ = new Subject<void>();
  lookupResult$ = this.submitter$.pipe(
    switchMap(() => this.lookuper.lookup(this.formGroup.getRawValue().address)),
    map((found) => (found ? 'Brochure sent' : 'Address not found'))
  );

  ngOnInit(): void {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }
  }

  search(): void {
    this.submitter$.next();
  }
}
