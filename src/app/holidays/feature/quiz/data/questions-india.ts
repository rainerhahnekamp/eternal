import { createQuestion, Question } from '@app/holidays/feature/quiz/model';
/**
 * Questions from:
 * - https://www.britannica.com/quiz/explore-india
 * - https://www.londonschool.com/young-adults/india-culture-quiz/
 */

const create = (
  question: string,
  solution: string,
  choices: string[],
  explanation: string,
) => createQuestion(question, solution, choices, explanation, 2);

export const questionsIndia: Question[] = [
  create(
    'Which is the national tree of India?',
    'Banyan',
    ['Neem', 'Peepal', 'Mango'],
    'The Banyan tree is the national tree of India. It is also called the Indian banyan or banyan fig.\n',
  ),
  create(
    'Hinduism is followed by 84% of India’s population. Which Hindu God is the creator of the universe?',
    'Brahma',
    ['Vishnu', 'Shiva'],
    'Brahma is the creator of the universe, Vishnu is its preserver and Shiva its destroyer',
  ),
  create(
    'In India, how do people traditionally eat their food?',
    'Right Hand',
    ['Left Hand', 'Knife & Fork'],
    'Usually, Indians avoid using cutlery when eating their food, even though spoons are used in restaurants for eating dishes such as dhal. Eat using only the fingertips of your right hand as eating with the left is considered rude.',
  ),
  create(
    'Which major festival in India signifies the victory of light over darkness?',
    'Diwali',
    ['Ramadan', 'Holi'],
    'The Hindu festival, Diwali, is known as the festival of light and the word ‘Diwali’ means “the row of lighted lamps”. During Diwali, houses are lit with traditional diyas - earthen lamps – to attract Lakshmi, the goddess of wealth and prosperity.',
  ),
  create(
    "When is India's Independence Day?",
    '15. August',
    ['31. October', '1. January', '14. July'],
    'Independence Day is observed in India annually on August 15. It celebrates the creation of a free and independent India in 1947.',
  ),
  create(
    'What Indian city is the capital of two states?',
    'Chandigarh',
    ['Mumbai', 'Kolkata', 'Chennai'],
    'The city of Chandigarh is the joint capital of Punjab and Haryana. (It is also the capital of the Chandigarh union territory, within which it is situated.)',
  ),
  create(
    'Which Indian composer won the Academy Award for Best Music (original song)?',
    'A.R. Rahman',
    ['Kalyanji Anandji', 'Amit Trivedi', 'Shankar Mahadevan'],
    'A.R. Rahman won the Academy Award for best song for “Jai Ho” for the film Slumdog Millionaire (2008), directed by Danny Boyle.',
  ),
  create(
    'Who wrote the Ramayana?',
    'Valmiki',
    ['Tulsidasa', 'Ved Vyas', 'Kalidasa'],
    'Valmiki was a Hindu sage who wrote Ramayana. Ramayana is one of the two epic poems, composed in Sanskrit. It narrates the life of Rama.',
  ),
];
