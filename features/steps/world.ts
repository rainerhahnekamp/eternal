import {World, setWorldConstructor} from "@cucumber/cucumber";
import {chromium, Page} from "@playwright/test";

export interface ICustomWorld extends World {
  readonly page: Page;

  openUrl(url: string): Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  _page: Page | undefined;

  get page() {
    if (!this._page) {
      throw new Error("page not available")
    }

    return this._page;
  }

  async openUrl(url: string) {

    const browser = await chromium.launch({
      headless: false,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
  }
}

setWorldConstructor(CustomWorld);
