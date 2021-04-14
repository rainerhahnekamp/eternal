import { BasicData } from '../../src/app/security/sign-up/basic/basic.component';
import { DetailData } from '../../src/app/security/sign-up/detail/detail.component';
import { InterestsData } from '../../src/app/security/sign-up/interests/interests.component';
import { BaseApi } from './base-api';

class Api extends BaseApi {
  signUp(basicData: BasicData, detailData: DetailData, interests: InterestsData) {
    return this.post('security/sign-up', {
      email: detailData.email,
      password: detailData.password,
      firstname: detailData.firstname,
      name: detailData.name
    }).then((response) => response.body as { userId: number });
  }

  signIn(email: string, password: string) {
    return this.post('security/sign-in', {
      email,
      password
    }).then((response) => response.body);
  }

  activate(userId: number, code: string) {
    return this.post(`security/activate-user-by-code/${userId}/${code}`, {});
  }
}

export const api = new Api();
