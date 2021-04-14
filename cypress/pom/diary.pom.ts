class Diary {
  verify() {
    return cy.getByAttr('diary-header');
  }
}

export const diary = new Diary();
