import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  styles: [],
})
export class RequestInfoComponent implements OnInit {
  formGroup: FormGroup;
  title = 'Request More Information';
  @Input() address: string;
  submitter$ = new Subject<void>();
  lookupResult$: Observable<string>;
  lookuper = { lookup: (address) => of(false) };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      address: [],
    });
    if (this.address) {
      this.formGroup.setValue({ addresss: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => this.lookuper.lookup(this.formGroup.value.address)),
      map((found) => (found ? 'Brochure sent' : 'Address not found'))
    );
  }

  search(): void {
    this.submitter$.next();
  }
}
