import { Question, Quiz } from '../model/model';

let currentId = 1;

export function createQuiz(
  holidayId: number,
  quiz: Partial<Quiz> = {},
  ...questions: Question[]
): Quiz {
  return {
    ...{
      title: 'Test Quiz',
      questions: [],
      timeInSeconds: 180,
    },
    ...quiz,
    questions: [...questions],
    holidayId,
    id: currentId++,
  };
}

export const createQuestion = (
  question: string,
  solution: string,
  choices: string[],
  explanation: string,
): Question => {
  return {
    id: currentId++,
    question,
    correctAnswer: 1,
    givenAnswer: undefined,
    choices: [
      { id: 1, text: solution },
      ...choices.map((choice, ix) => ({ id: ix + 2, text: choice })),
    ],
    explanation,
  };
};
