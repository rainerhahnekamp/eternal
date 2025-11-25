import { expect, test } from '@testronaut/angular';
import { CustomerRegistrationScreen } from './customer-registration-screen';

test('should display success message', async ({ page, mount }) => {
  await mount(CustomerRegistrationScreen);

  const values = {
    'First Name': 'Rainer',
    'Last Name': 'Hahnekamp',
    'Email Address': 'rainer.hahnekamp@example.com',
  };

  for (const [label, value] of Object.entries(values)) {
    await page.getByRole('textbox', { name: label }).fill(value);
  }

  await page
    .getByRole('textbox', { name: 'Password', exact: true })
    .fill('rainer123');
  await page
    .getByRole('textbox', { name: 'Confirm Password', exact: true })
    .fill('rainer123');

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('status')).toContainText(
    'Thanks for registering!',
  );
});
