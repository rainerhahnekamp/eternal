import { screen } from '@testing-library/angular';

export const ui = {
  question: (question: string) =>
    screen.findByRole('region', { name: question }),
  correctStatus: () =>
    screen
      .findByRole('status', { name: 'correct' })
      .then((el) => el.textContent),
  incorrectStatus: () =>
    screen
      .findByRole('status', { name: 'incorrect' })
      .then((el) => el.textContent),
};
