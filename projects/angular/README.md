# Cypress Angular Component Testing
This library is used to do Cypress Component Testing with Angular 12+

## Getting Started
To install the package you need to first install it using:

```bash
npm install cypress-angular-component-testing
```

Next we need to add the following file to our cypress support file:

```javascript
// cypress/support/compoennt.js
import 'cypress-angular-component-testing/support';

```

The next thing we need to do is setup our dev server using the `cypress-angular-dev-server` package:

```bash
npm install cypress-angular-dev-server
```

Next we need to add this to our Cypress config file:

```typescript
// cypress.config.ts

import { defineConfig } from 'cypress';
import { devServer } from 'cypress-angular-dev-server';

export default defineConfig({
    component: {
        devServer,
        ...
    },
    ...
})
```

Finally we can start creating Angular Component Tests directly in our application using the `.cy.ts` file extension and the Cypress `mount()` command. Here is an example:

```typescript
// app.component.cy.ts (located in the same directory as app.component.ts)

import { mount } from 'cypress-angular-component-testing'; // the local path would be ./{rootDirectory}/projects/angular/src/public_api
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    it('mounts AppComponent', () => {
        mount(AppComponent)
        // your cypress code goes here: cy.get('...').contains('......'), etc
    })
})
```

Note that the `mount` command takes in an optional 2nd parameter which accepts your TestBed MetaData as well as any of your Component's `@Input()` properties. Here is an example:

```typescript
// my-other.component.ts

@Component({...})
export class MyOtherComponent {
    @Input() title: string;

    constructor(private readonly service: MyOtherService) {}

    doSomething(value): void {
        this.service.doSomething(value)
    }
}

```

```typescript
import { mount } from 'cypress-angular-component-testing'; // the local path would be ./{rootDirectory}/projects/angular/src/public_api
import { MyOtherComponent } from './my-other.component.ts';
import { MyOtherService } from 'services/my-other.service.ts';
import { MyOtherModule } from './my-other.module.ts';

describe('MyOtherComponent', () => {
    it('mounts and displays the passed in input title in the DOM', () => {
        mount(MyOtherComponent, {
            inputs: { title: 'My Test Title' },
            imports: [MyOtherModule],
            providers: [MyOtherService]
        });
        cy.get('h1').contains('My Test Title')
    })
})
```

### Running The Tests
The final thing to do is just open Cypress!

```bash
npx cypress open
```

**You can also use the `--component` flag if you just want to run the component tests**

You can also run cypress headlessly using:

```bash
npx cypress run --component
```