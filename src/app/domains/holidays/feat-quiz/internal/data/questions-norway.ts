import {
  createQuestion,
  Question,
} from '@app/domains/holidays/feat-quiz/internal/model';

/**
 * Questions from:
 * - https://www.swedishnomad.com/norway-quiz/
 */

const create = (
  question: string,
  solution: string,
  choices: string[],
  explanation: string,
) => createQuestion(question, solution, choices, explanation, 1);

export const questionsNorway: Question[] = [
  create(
    'What is the national dish of Norway?',
    'Fårikål',
    ['Lutefisk', 'Kjøttkaker', 'Pølse med Lompe'],
    "The national dish of Norway is called Fårikål. It's a dish that is made with sheep- or lamb meat and cabbage that is cooked in a pot. The inofficial national dish of Norway is the frozen pizza from Grandiosa.",
  ),
  create(
    'What currency is used in Norway?',
    'Norwegian crown',
    ['Euro', 'Norwegian rigsdaler', 'Norwegian Dollar'],
    'The currency of Norway is called Norwegian crowns, or Norske kroner. It was introduced in 1875. Norwegian crowns are used as currency on Svalbard and Jan Mayen.',
  ),
  create(
    'How many people are living in Norway?',
    '5.4m',
    ['7.8m', '3m', '8.5m'],
    'There are around 5,4 million people living in Norway with a density of 14,1 inhabitants per km².',
  ),
  create(
    'Which is the highest mountain in Norway?',
    'Galdhøpiggen',
    ['Storsylen', 'Store Styggedalstinden', 'Glittertind'],
    'Galdhøpiggen is the tallest mountain in Norway with a height of 2469 meters (8100 ft) above sea level.',
  ),
];
