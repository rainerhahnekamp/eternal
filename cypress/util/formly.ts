import { format } from 'date-fns';

export interface FieldConfig<T> {
  radio?: (keyof T)[];
  date?: (keyof T)[];
  select?: (keyof T)[];
  multicheckbox?: (keyof T)[];
  multiSelect?: (keyof T)[];
  textarea?: (keyof T)[];
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
  // checkCreationValidation(
  //   values: { [key: string]: any },
  //   url: string,
  //   fields: FieldConfig,
  //   componentName: string
  // ) {
  //   values.forEach((field, index, array) => {
  //     this.fillIn(field, fields, componentName);
  //   });
  // }

  fillIn<T>(values: T, fields: FieldConfig<T>, componentName: string) {
    const fieldMap = this.getMap(values, fields);
    fieldMap.forEach((fieldConfigType, fieldName) => {
      const value = values[fieldName];

      if (value instanceof Date && fieldConfigType === 'date') {
        this.date(fieldName, value, componentName);
        return;
      }

      if (typeof value === 'string') {
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
        }
        return;
      }

      if (value instanceof Array) {
        switch (fieldConfigType) {
          case 'multicheckbox':
            this.multicheckbox(fieldName, value, componentName);
            break;
          case 'multiSelect':
            this.multiSelect(fieldName, value, componentName);
            break;
        }
      }
    });
  }

  getValue(name: string) {
    return cy.get(`.formly-${name} input`);
  }

  private getMap<T>(values: T, fields: FieldConfig<T>): Map<keyof T, FieldConfigType> {
    const returner = new Map<keyof T, FieldConfigType>();
    Object.keys(values).forEach((k) => {
      const key: keyof T = k as keyof T;
      if (fields.select && fields.select.includes(key)) {
        returner.set(key, 'select');
      } else if (fields.radio && fields.radio.includes(key)) {
        returner.set(key, 'radio');
      } else if (fields.date && fields.date.includes(key)) {
        returner.set(key, 'date');
      } else if (fields.multiSelect && fields.multiSelect.includes(key)) {
        returner.set(key, 'multiSelect');
      } else if (fields.textarea && fields.textarea.includes(key)) {
        returner.set(key, 'textarea');
      } else if (fields.multicheckbox && fields.multicheckbox.includes(key)) {
        returner.set(key, 'multicheckbox');
      } else {
        returner.set(key, 'input');
      }
    });
    return returner;
  }

  private input<T>(name: keyof T, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} input`).clear().type(value);
  }

  private textarea<T>(name: keyof T, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} textarea`).clear().type(value);
  }

  private select<T>(name: keyof T, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} mat-select`).click();
    cy.get('.mat-option-text').contains(value).click();
  }

  private radio<T>(name: keyof T, value: string, componentName: string) {
    cy.get(`${componentName} .formly-${name} input[value=${value}]`)
      .parents('mat-radio-button')
      .click();
  }

  private date<T>(name: keyof T, value: Date, componentName: string) {
    cy.get(`${componentName} .formly-${name} input`).type(format(value, 'dd.MM.yyyy'));
  }

  private multicheckbox<T>(name: keyof T, values: string[], componentName: string) {
    values.forEach((value) => {
      cy.get(`${componentName} .formly-${name} label`).contains(value).click();
    });
  }

  private multiSelect<T>(name: keyof T, values: string[], componentName: string) {
    values.forEach((value) => {
      cy.get(`${componentName} .formly-${name} mat-select`).click();
      cy.get('.mat-option-text').contains(value).click();
      cy.get('.cdk-overlay-backdrop').click(-50, -50, { force: true });
    });
  }
}

export const formly = new FormlyFields();
