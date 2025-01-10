export interface Question {
  id: number;
  question: string;
  answers: { id: number; answer: string; isCorrect: boolean }[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}
