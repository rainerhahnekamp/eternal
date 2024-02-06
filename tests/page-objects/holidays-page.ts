import { Holiday } from '@app/holidays/model';
import { Page } from '@playwright/test';

let id = 1;

export function createHoliday(holiday: Partial<Holiday> = {}): Holiday {
  return {
    ...{
      id: id++,
      title: 'Vienna',
      teaser: 'A holiday to Vienna',
      description:
        'This is the description of this holiday. Should be a little bit longer than the teaser',
      imageUrl: 'dummy.jpg',
      typeId: 1,
      durationInDays: 3,
      minCount: 5,
      maxCount: 12,
      soldOut: false,
      onSale: false,
    },
    ...holiday,
  };
}

export function createHolidays(...holidays: Partial<Holiday>[]) {
  return holidays.map(createHoliday);
}

export class HolidaysPage {
  constructor(private page: Page) {}

  /**
   *
   * @param holidays partial values for holidays to be mocked
   * @param append adds the holidays on top of the original ones
   */
  mockHolidays(holidays: Partial<Holiday>[], append = false) {
    const entities = holidays.map((holiday) => createHoliday(holiday));

    this.page.route(
      'https://api.eternal-holidays.net/holiday',
      async (route) => {
        if (append) {
          const response = await route.fetch();
          const h = await response.json();

          const finalResponse = [...h, ...entities];
          console.log(finalResponse);

          await route.fulfill({
            status: 200,
            json: [...entities, h[3]],
          });
        } else {
          route.fulfill({
            status: 200,
            json: entities,
          });
        }
      },
    );
  }
}
