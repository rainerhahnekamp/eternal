import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BasicData } from './basic/basic.component';
import { DetailData } from './detail/detail.component';
import { InterestsData } from './interests/interests.component';

interface SignUpData {
  basic: BasicData;
  detail: DetailData;
  interests: InterestsData;
}

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent {
  @ViewChild('stepper') stepper: MatStepper | undefined;
  signUpData: SignUpData = {
    basic: { userType: 'customer' },
    detail: {
      firstname: '',
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      street: '',
      streetNumber: '',
      zip: '',
      city: '',
      country: '',
      birthdate: new Date(0)
    },
    interests: {
      continents: [],
      travelVariation: [],
      favouredDuration: '',
      travelType: '',
      comment: ''
    }
  };

  constructor(private httpClient: HttpClient, private router: Router) {}

  nextBasic(basicData: BasicData) {
    if (!this.stepper) {
      return;
    }
    this.signUpData.basic = basicData;
    this.stepper.next();
  }

  nextDetail(detailData: DetailData) {
    if (!this.stepper) {
      return;
    }
    this.signUpData.detail = detailData;
    this.stepper.next();
  }

  nextInterests(interestsData: InterestsData) {
    if (!this.stepper) {
      return;
    }

    this.signUpData.interests = interestsData;
    this.stepper.next();
  }

  finish() {
    const { email, password, firstname, name } = this.signUpData.detail;
    this.httpClient
      .post<{ userId: number }>('/security/sign-up', {
        email,
        password,
        firstname,
        name
      })
      .subscribe(({ userId }) => {
        const urlTree = this.router.createUrlTree(['/security/activate', userId]);
        this.router.navigateByUrl(urlTree);
      });
  }
}
