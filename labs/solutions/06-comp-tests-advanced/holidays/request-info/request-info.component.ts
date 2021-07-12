import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddressLookuper } from '../../shared/address-lookuper.service';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  styles: []
})
export class RequestInfoComponent implements OnInit, OnChanges {
  formGroup: FormGroup = this.formBuilder.group({
    address: []
  });
  title = 'Request More Information';
  @Input() address = '';
  submitter$ = new Subject<void>();
  lookupResult$: Observable<string> | undefined;

  constructor(private formBuilder: FormBuilder, private lookuper: AddressLookuper) {}

  ngOnInit(): void {
    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => this.lookuper.lookup(this.formGroup.value.address)),
      map((found) => (found ? 'Brochure sent' : 'Address not found'))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }
  }

  search(): void {
    this.submitter$.next();
  }
}
