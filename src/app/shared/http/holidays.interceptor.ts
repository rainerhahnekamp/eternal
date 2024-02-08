// eslint-disable-next-line @softarc/sheriff/dependency-rule
import { createHoliday, Holiday } from '@app/holidays/model';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Configuration } from '@app/shared/config';
import { of } from 'rxjs';

export const holidays: Holiday[] = [
  createHoliday({
    title: 'India',
    teaser:
      'Diverse landscapes, rich culture, vibrant traditions enchant visitors.',
    description:
      'From the iconic Taj Mahal in Agra to the bustling streets of Delhi and the serene backwaters of Kerala, the country offers a kaleidoscope of experiences.',
    imageUrl: '/assets/india.jpg',
    typeId: 1,
    durationInDays: 14,
    minCount: 8,
    maxCount: 24,
    onSale: false,
    soldOut: false,
    hasQuiz: true,
  }),
  createHoliday({
    title: 'Canada Rocky Mountains',
    teaser: 'Breathtaking vistas and outdoor adventures.',
    description:
      "With stunning alpine lakes and diverse wildlife, it's a perfect destination for those seeking both adventure and tranquility.",
    imageUrl: '/assets/canada.jpg',
    typeId: 1,
    durationInDays: 7,
    minCount: 8,
    maxCount: 24,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Japan',
    teaser:
      'Rich cultural tapestry, blending tradition with modern innovation.',
    description:
      'From serene temples to bustling cityscapes, Japan offers a dynamic tapestry of experiences for travelers to explore.',
    imageUrl: '/assets/japan.jpg',
    typeId: 1,
    durationInDays: 7,
    minCount: 8,
    maxCount: 24,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Vienna / Wien',
    teaser: 'Dive into the capital of the Habsburg empire',
    description:
      'With a population of almost 2 million, Vienna is the second largest German-speaking city and breathes history in every corner.',
    imageUrl: '/assets/vienna.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 12,
    onSale: true,
    soldOut: false,
  }),
  createHoliday({
    title: 'London',
    teaser: "Explore one of the world's most famous cities",
    description:
      'Being a tourist magnet, this city needs no further introduction.',
    imageUrl: '/assets/london.jpg',
    typeId: 1,
    durationInDays: 12,
    minCount: 8,
    maxCount: 15,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Detroit',
    teaser: 'Top 10 of the cosmopolitan cities of the world',
    description:
      "This US city is mainly known for the autombile industry. It hosts the GM's headquarters.",
    imageUrl: '/assets/detroit.jpg',
    typeId: 2,
    durationInDays: 14,
    minCount: 2,
    maxCount: 10,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Reykjavík',
    teaser: 'The northernmost capital of the world and entry to Iceland',
    description:
      'Iceland is a small island between Europe and America. It is best known for its nature and landscape which look almost alien.',
    imageUrl: '/assets/reykjavík.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 15,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Copenhagen / København',
    teaser: "Europe's most livable city",
    description:
      'Copenhagen is the capital of Denmark and is located on Seenland which is one of the three main Danish islands.',
    imageUrl: '/assets/copenhagen.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 15,
    onSale: false,
    soldOut: true,
  }),
  createHoliday({
    title: 'Shanghai / 上海市',
    teaser: 'East meets West',
    description:
      'Although not being the capital of China, Shanghai is a good choice to for a China voyage. It can be reached very easily.',
    imageUrl: '/assets/shanghai.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 15,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Florence/ Firenze',
    teaser: "Michelangelo's David, da Vinci, and Chianti",
    description:
      'Birthplace of the Renaissance. Many famous artists left their mark. You can marvel at them at the Uffizi Gallery.',
    imageUrl: '/assets/firenze.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 15,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Granada',
    teaser: 'Muslim history in Spain',
    description:
      'The Alhambra is not just the major attraction in Granada but also counts to the top must-sees in whole Spain.',
    imageUrl: '/assets/granada.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 15,
    onSale: false,
    soldOut: false,
  }),
  createHoliday({
    title: 'Lübeck',
    teaser: 'City of the Hanseatic League',
    description:
      'A medieval city in the North of Germany and home place to the famous Hanseatic League.',
    imageUrl: '/assets/luebeck.jpg',
    typeId: 1,
    durationInDays: 3,
    minCount: 5,
    maxCount: 15,
    onSale: false,
    soldOut: false,
  }),
];

export const holidaysInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(Configuration);

  if (!config.mockHolidays || !req.url.startsWith('/holiday')) {
    next(req);
  }

  return of(new HttpResponse({ body: holidays }));
};
