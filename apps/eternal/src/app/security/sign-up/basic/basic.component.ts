import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

type UserType = 'customer' | 'agent';

export interface BasicData {
  userType: UserType;
}

@Component({
  selector: 'app-sign-up-basic',
  templateUrl: './basic.component.html'
})
export class BasicComponent {
  @Output() next = new EventEmitter<BasicData>();
  formGroup = new FormGroup({});

  handleUserType(userType: UserType) {
    this.next.emit({ userType });
  }
}
