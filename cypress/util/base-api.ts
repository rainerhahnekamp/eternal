import RequestBody = Cypress.RequestBody;

export class BaseApi {
  baseUrl = Cypress.env('apiUrl');

  protected post(url: string, data: RequestBody) {
    return cy.request('POST', `${this.baseUrl}/${url}`, data);
  }
}
