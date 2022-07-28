import '../../projects/angular/support/index';
import { mount } from '../../projects/angular/src/lib/mount';
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
