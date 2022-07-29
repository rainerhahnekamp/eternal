- [1. Cypress Component Testing](#1-cypress-component-testing)
  - [1.1 Mounting](#11-mounting)
  - [1.2 Add Styling](#12-add-styling)
  - [1.3 Testing `@Input()`](#13-testing-input)
  - [1.4 Mocking the network via `cy.intercept`](#14-mocking-the-network-via-cyintercept)

# 1. Cypress Component Testing

## 1.1 Mounting

You write a test for the `RequestInfoComponent` by using Cypress' component runner. That feature allows you to test a component in isolution by using all the capabilities of the Cypress framework.

Create and add following content to the file **/apps/eternal/src/app/holidays/request-info/request-info.cy.ts**.

```typescript
import { TestBedConfig } from '../../../../../../projects/angular/src/lib/mount';
import { RequestInfoComponent } from './request-info.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RequestInfoComponentModule } from './request-info.component.module';

const config: TestBedConfig<RequestInfoComponent> = {
  imports: [RequestInfoComponentModule, NoopAnimationsModule, HttpClientModule]
};

describe('Request Info Component', () => {
  it('should mount it', () => {
    cy.mount(RequestInfoComponent, config);
  });
});
```

Go to Cypress initial screen, click on component testing and run the test. It should be successful.

## 1.2 Add Styling

There is no possibility yet, to include global styling. Write a wrapper component that

- embeds the `RequestInfoComponent`,
- includes the `link` tags to import the fonts and material icons,
- contains the global `styles.scss` in its `styleUrls`, and
- uses `ViewEncapsulation.None`

Use that component in your existing test.

<details>
<summary>Show Solution</summary>
<p>

```typescript
@Component({
  template: ` <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    /><app-request-info></app-request-info>`,
  styleUrls: ['../../../styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WrapperComponent {}
const config: TestBedConfig<RequestInfoComponent> = {
  declarations: [WrapperComponent],
  imports: [RequestInfoComponentModule, NoopAnimationsModule, HttpClientModule]
};

describe('Request Info Component', () => {
  it('should mount it', () => {
    cy.mount(WrapperComponent, config);
  });
});
```

</p>
</details>

## 1.3 Testing `@Input()`

Write a test with a new `TestBedConfig` where you only mount the `RequestInfoComponent` but use the additional `inputs` property to set the address to "Domgasse 5".

Verify that the input field's value is set.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should set the address', () => {
  cy.mount(RequestInfoComponent, {
    imports: [RequestInfoComponentModule, NoopAnimationsModule, HttpClientModule],
    inputs: { address: 'Domgasse 5' }
  });
  cy.testid('address').should('have.value', 'Domgasse 5');
});
```

</p>
</details>

## 1.4 Mocking the network via `cy.intercept`

Write a parameterised test where you test against a valid and a non-valid address. Use `cy.intercept` to mock the network communication.

<details>
<summary>Show Solution</summary>
<p>

```typescript
  for (const { message, response } of [
    { message: 'Brochure sent', response: ['address'] },
    { message: 'Address not found', response: [] }
  ]) {
    it(`should intercept the network and return ${response} for ${message}`, () => {
      cy.intercept(/nominatim/, { body: response });
      cy.mount(WrapperComponent, {
        declarations: [WrapperComponent],
        imports: [RequestInfoComponentModule, NoopAnimationsModule, HttpClientModule]
      });

      cy.testid('address').type('Domgasse 5');
      cy.testid('btn-search').click();
      cy.testid('lookup-result').should('contain.text', message);
    });
  }
```

</p>
</details>