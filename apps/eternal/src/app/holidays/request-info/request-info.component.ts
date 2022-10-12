import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'eternal-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe]
})
export class RequestInfoComponent implements OnInit {
  formGroup = inject(NonNullableFormBuilder).group({
    address: ['', Validators.required]
  });
  lookuper = { lookup: (address: string) => of(false) };

  title = 'Request More Information';
  @Input() address = '';
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
