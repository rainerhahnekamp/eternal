export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export type Question = {
  id: number;
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
): Question => {
  return {
    id: currentId++,
    question,
    answer: 1,
    choices: shuffleArray([
      { id: 1, text: solution },
      ...choices.map((choice, ix) => ({ id: ix + 2, text: choice })),
    ]),
    explanation,
    status: 'unanswered',
  };
};

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
