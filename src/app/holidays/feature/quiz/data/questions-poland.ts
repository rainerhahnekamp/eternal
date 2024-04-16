import { createQuestion, Question } from '@app/holidays/feature/quiz/model';

const create = (
  question: string,
  solution: string,
  choices: string[],
  explanation: string,
) => createQuestion(question, solution, choices, explanation, 15);

export const questionsPoland: Question[] = [
  create(
    'What is the national dish of Poland?',
    'Bigos',
    ['Pierogi', 'Zurek', 'Kotlet schabowy'],
    'The national dish of Poland is called Bigos. It is a traditional meat and cabbage stew.',
  ),
  create(
    'What currency is used in Poland?',
    'Polish złoty',
    ['Euro', 'Grosz', 'Polish dollar'],
    'The currency of Poland is called Polish złoty. The currency code is PLN.',
  ),
  create(
    'How many people are living in Poland?',
    '38m',
    ['42m', '30m', '45m'],
    'There are around 38 million people living in Poland with a density of 123 inhabitants per km².',
  ),
  create(
    'Which is the highest mountain in Poland?',
    'Rysy',
    ['Kozi Wierch', 'Koscielec', 'Swinica'],
    'Rysy is the tallest mountain in Poland with a height of 2503 meters (8209 ft) above sea level.',
  ),
];
