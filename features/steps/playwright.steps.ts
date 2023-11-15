
import {Given, When} from '@cucumber/cucumber';
import {ICustomWorld} from "./world";

Given('{string} opens Eternal}', async function (this: ICustomWorld) {
  const page = this.page;
  await page.goto('http://localhost:4200');
});

When('{string} navigates to {string}', async function (this: ICustomWorld, name: string, menu: string) {
  console.log(name);
  const page = this.page;
  await page.getByRole('link', {name: menu, exact: true}).click()
});
