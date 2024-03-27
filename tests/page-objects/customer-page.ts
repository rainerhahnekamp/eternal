import { Page } from '@playwright/test';

interface CustomerData {
  firstname?: string;
  lastname?: string;
  birthday?: Date;
  country?: string;
  address: string;
  zusatz: string;
}

type CustomerDataWithoutAddress = {
  firstname?: string;
  lastname?: string;
  birthday?: Date;
  country?: string;
};

export class CustomerPage {
  constructor(private page: Page) {}

  async fillIn(customerData: CustomerData) {
    if (customerData.firstname !== undefined) {
      await this.page.getByLabel('Firstname').fill(customerData.firstname);
    }

    if (customerData.lastname !== undefined) {
      await this.page
        .getByLabel('Name', { exact: true })
        .fill(customerData.lastname);
    }

    if (customerData.birthday !== undefined) {
      const day = customerData.birthday.getDate();
      const month = customerData.birthday.getMonth() + 1;
      const year = customerData.birthday.getFullYear();
      await this.page.getByLabel('Birthdate').fill(`${day}.${month}.${year}`);
    }

    if (customerData.country !== undefined) {
      await this.page.getByLabel('Country').click();
      await this.page
        .getByRole('option', { name: customerData.country })
        .click();
    }
  }

  async remove() {
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    this.add({
      firstname: 'asdf',
      lastname: '',
      birthday: new Date(),
      country: 'at',
      address: '',
    });
  }

  async add(
    customerData: Required<CustomerData | CustomerDataWithoutAddress>,
  ) {}
}
