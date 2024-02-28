export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export type Question = {
  id: number;
  holidayId: number;
  question: string;
  answer: number;
  choices: { id: number; text: string }[];
  explanation: string;
  status: AnswerStatus;
};

export type Quiz = {
  title: string;
  questions: Question[];
  timeInSeconds: number;
};

let currentId = 1;

export const createQuestion = (
  question: string,
  solution: string,
  choices: string[],
  explanation: string,
  holidayId: number,
): Question => {
  return {
    id: currentId++,
    holidayId,
    question,
    answer: 1,
    choices: [
      { id: 1, text: solution },
      ...choices.map((choice, ix) => ({ id: ix + 2, text: choice })),
    ],
    explanation,
    status: 'unanswered',
  };
};
