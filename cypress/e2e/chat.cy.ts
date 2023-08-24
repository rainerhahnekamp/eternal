type WsData = {
  message?: string;
  status?: string;
};

type WsClient = {
  (callback: (value: WsData) => void): void;
};

declare namespace Cypress {
  interface Chainable {
    window(): Chainable<{ wsClient: WsClient }>;
  }
}

describe('Chat', () => {
  it('should connect to the WebSocket', () => {
    cy.visit('');
    cy.window().then((w) => {
      w.wsClient = (callback: (value: WsData) => void) => {
        callback({ status: 'connected' });
      };
    });
    cy.findByRole('button', { name: 'Enable Chat' }).click();
    cy.findByText('Connection established').should('be.visible');
    cy.findByRole('link', { name: 'Chat' }).should('be.visible');
  });

  it('should fail in connecting to the WebSocket', () => {
    cy.visit('');
    cy.window().then((w) => {
      w.wsClient = (callback: (value: WsData) => void) => {
        throw new Error('nothing works here');
      };
    });
    cy.findByRole('button', { name: 'Enable Chat' }).click();
    cy.findByText('Could not establish connection').should('be.visible');
  });

  it('should show the total amount of chat messages in the menu link', () => {
    cy.visit('');
    cy.window().then((w) => {
      w['wsClient'] = (callback: (value: WsData) => void) => {
        callback({ status: 'connected' });
        callback({ message: 'This is the first message' });
        callback({ message: 'This is the second message' });
      };
    });

    cy.findByRole('button', { name: 'Enable Chat' }).click();
    cy.findByRole('link', { name: 'Chat' })
      .find('.mat-badge-content')
      .should('have.text', 2);
  });

  it('should show the total amount of chat messages in the menu link', () => {
    cy.visit('');
    cy.window().then((w) => {
      w.wsClient = (callback: (value: WsData) => void) => {
        callback({ status: 'connected' });
        callback({ message: 'This is the first message' });
        callback({ message: 'This is the second message' });
      };
    });

    cy.findByRole('button', { name: 'Enable Chat' }).click();
    cy.findByRole('link', { name: 'Chat' }).as('chatLink');
    cy.get('@chatLink').find('.mat-badge-content').should('have.text', 2);
    cy.get('@chatLink').click();
    cy.findByText('This is the first message').should('be.visible');
    cy.findByText('This is the second message').should('be.visible');
  });
});
