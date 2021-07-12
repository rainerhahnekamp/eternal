import { AsyncFactoryFn, ComponentHarness, TestElement } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'app-request-info';
  protected getInput = this.locatorFor(MatInputHarness);
  protected getTitle = this.locatorFor('h2');
  protected getButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[data-test=btn-search]' })
  );
  protected getLookupResult = this.attrLocator('lookup-result');

  async submit(): Promise<void> {
    const button = await this.getButton();
    return button.click();
  }

  async writeAddress(address: string): Promise<void> {
    const input = await this.getInput();
    return input.setValue(address);
  }

  async getResult(): Promise<string> {
    const p = await this.getLookupResult();
    return p.text();
  }

  protected attrLocator(tag: string): AsyncFactoryFn<TestElement> {
    return this.locatorFor(`[data-test=${tag}]`);
  }
}
