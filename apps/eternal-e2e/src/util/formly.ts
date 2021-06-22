import { format } from 'date-fns';

export interface FieldConfig {
  radio?: string[];
  date?: string[];
  select?: string[];
  multicheckbox?: string[];
  multiSelect?: string[];
  textarea?: string[];
}

type FieldConfigType =
  | 'input'
  | 'radio'
  | 'date'
  | 'select'
  | 'multiSelect'
  | 'multicheckbox'
  | 'textarea';

class FormlyFields {
  checkCreationValidation(
    values: { [key: string]: any },
    url: string,
    fields: FieldConfig,
    componentName: string
  ) {
    values.forEach((field, index, array) => {
      this.fillIn(field, fields, componentName);
    });
  }

  fillIn(values: { [key: string]: any }, fields: FieldConfig, componentName: string) {
    Object.entries(this.getMap(values, fields)).forEach(([fieldName, fieldConfigType]) => {
      const value = values[fieldName];
      switch (fieldConfigType) {
        case 'input':
          this.input(fieldName, value, componentName);
          break;
        case 'textarea':
          this.textarea(fieldName, value, componentName);
          break;
        case 'select':
          this.select(fieldName, value, componentName);
          break;
        case 'radio':
          this.radio(fieldName, value, componentName);
          break;
        case 'date':
          this.date(fieldName, value, componentName);
          break;
        case 'multicheckbox':
          this.multicheckbox(fieldName, value, componentName);
          break;
        case 'multiSelect':
          this.multiSelect(fieldName, value, componentName);
          break;
      }
    });
  }

  getValue(name: string) {
    return cy.get(`.formly-${name} input`);
  }

  private getMap(values: { [key: string]: any }, fields: FieldConfig) {
    const returner: { [key: string]: FieldConfigType } = {};
    Object.keys(values).forEach((key) => {
      if (fields.select && fields.select.includes(key)) {
        returner[key] = 'select';
      } else if (fields.radio && fields.radio.includes(key)) {
        returner[key] = 'radio';
      } else if (fields.date && fields.date.includes(key)) {
        returner[key] = 'date';
      } else if (fields.multiSelect && fields.multiSelect.includes(key)) {
        returner[key] = 'multiSelect';
      } else if (fields.textarea && fields.textarea.includes(key)) {
        returner[key] = 'textarea';
      } else if (fields.multicheckbox && fields.multicheckbox.includes(key)) {
        returner[key] = 'multicheckbox';
      } else {
        returner[key] = 'input';
      }
    });
    return returner;
  }

  private input(name: string, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} input`).clear().type(value);
  }

  private textarea(name: string, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} textarea`).clear().type(value);
  }

  private select(name: string, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name}`).click();
    cy.get('.mat-option-text').contains(value).click();
  }

  private radio(name: string, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} input[value=${value}]`)
      .parents('mat-radio-button')
      .click();
  }

  private date(name: string, value: Date, componentName: string) {
    cy.get(`${componentName} .formly-${name} input`).type(format(value, 'dd.MM.yyyy'));
  }

  private multicheckbox(name: string, values: string[], componentName: string) {
    values.forEach((value) => {
      cy.get(`${componentName} .formly-${name} label`).contains(value).click();
    });
  }

  private multiSelect(name: string, values: string[], componentName: string) {
    values.forEach((value) => {
      cy.get(`${componentName} .formly-${name}`).click();
      cy.get('.mat-option-text').contains(value).click();
      cy.get('.cdk-overlay-backdrop').click(-50, -50, { force: true });
    });
  }
}

export const formly = new FormlyFields();
