import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class CustomerComponentHarness extends ComponentHarness {
  static hostSelector = 'eternal-customer';

  protected getFirstnameInput = this.locatorFor(
    MatInputHarness.with({ selector: '.formly-firstname input' })
  );
  protected getNameInput = this.locatorFor(
    MatInputHarness.with({ selector: '.formly-name input' })
  );
  protected getCountry = this.locatorFor(MatSelectHarness);
  protected getBirthday = this.locatorFor(MatDatepickerInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness.with({ selector: '[type=submit]' }));

  async setFirstname(firstname: string) {
    const input = await this.getFirstnameInput();
    return input.setValue(firstname);
  }

  async setName(name: string) {
    const input = await this.getNameInput();
    return input.setValue(name);
  }

  async setCountry(name: string) {
    const select = await this.getCountry();
    await select.open();
    const [option] = await select.getOptions({ text: name });
    return option.click();
  }

  async setBirthday(birthday: Date) {
    const input = await this.getBirthday();
    return input.setValue(
      birthday.getMonth() + 1 + '/' + birthday.getDay() + '/' + birthday.getFullYear()
    );
  }

  async save() {
    const button = await this.getButton();
    return button.click();
  }
}
