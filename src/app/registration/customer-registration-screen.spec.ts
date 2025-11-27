import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { CustomerRegistrationScreen } from './customer-registration-screen';
import { userEvent, page } from 'vitest/browser';

describe('Customer Registration Screen', () => {
  it('should display the customer registration screen', async () => {
    const fixture = TestBed.createComponent(CustomerRegistrationScreen);
    await fixture.whenStable();

    const values = {
      'First Name': 'Rainer',
      'Last Name': 'Hahnekamp',
      'Email Address': 'rainer.hahnekamp@gmail.com',
      Password: 'rainer123',
      'Confirm Password': 'rainer123',
    };

    for (const [label, value] of Object.entries(values)) {
      await userEvent.type(
        page.getByRole('textbox', { name: label, exact: true }),
        value,
      );
    }

    await userEvent.click(page.getByRole('button', { name: 'Continue' }));

    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('Thanks for registering!');
  });
});
