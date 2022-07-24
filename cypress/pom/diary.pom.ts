class Diary {
  verify() {
    return cy.testid('diary-header');
  }
}

export const diary = new Diary();
