export type Question = {
  id: number;
  question: string;
  answer: number;
  choices: { id: number; text: string }[];
  explanation: string;
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
    choices: [
      { id: 1, text: solution },
      ...choices.map((choice, ix) => ({ id: ix + 2, text: choice })),
    ],
    explanation,
  };
};
