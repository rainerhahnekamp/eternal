import { BaseApi } from './base-api';

class TestApi extends BaseApi {
  signInAndCreateUser(email: string, password: string, firstname: string, name: string) {
    return this.post('test/sign-in-and-create-user', {
      email,
      password,
      firstname,
      name
    }).then((response) => response.body);
  }
}

export const testApi = new TestApi();
