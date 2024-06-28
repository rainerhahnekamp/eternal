import { Question } from '@app/holidays/feature/quiz/model';

const quizEgypt = {
  id: 4,
  title: 'Egypt Quiz',
  timeInSeconds: 300,
  questions: [
    {
      id: 32,
      question: 'What are the ancient Egyptian names of the three seasons?',
      explanation:
        'The ancient Egyptians had three seasons: Akhet (inundation), Peret (growing), and Shemu (harvest).',
      answers: [
        { id: 123, answer: 'Akhet, Peret, Shemu', isCorrect: true },
        { id: 124, answer: 'Spring, Summer, Autumn', isCorrect: false },
        { id: 125, answer: 'Winter, Spring, Summer', isCorrect: false },
        { id: 126, answer: 'Inundation, Growth, Harvest', isCorrect: false },
      ],
    },
    {
      id: 33,
      question: 'What is the capital of Egypt?',
      explanation: 'The capital of Egypt is Cairo.',
      answers: [
        { id: 127, answer: 'Cairo', isCorrect: true },
        { id: 128, answer: 'Alexandria', isCorrect: false },
        { id: 129, answer: 'Giza', isCorrect: false },
        { id: 130, answer: 'Luxor', isCorrect: false },
      ],
    },
    {
      id: 34,
      question: 'What is the official language of Egypt?',
      explanation: 'The official language of Egypt is Arabic.',
      answers: [
        { id: 131, answer: 'Arabic', isCorrect: true },
        { id: 132, answer: 'English', isCorrect: false },
        { id: 133, answer: 'French', isCorrect: false },
        { id: 134, answer: 'German', isCorrect: false },
      ],
    },
    {
      id: 35,
      question: 'Which river runs through Egypt?',
      explanation: 'The Nile River runs through Egypt.',
      answers: [
        { id: 135, answer: 'Nile', isCorrect: true },
        { id: 136, answer: 'Amazon', isCorrect: false },
        { id: 137, answer: 'Yangtze', isCorrect: false },
        { id: 138, answer: 'Mississippi', isCorrect: false },
      ],
    },
    {
      id: 36,
      question: 'What is the currency of Egypt?',
      explanation: 'The currency of Egypt is the Egyptian Pound.',
      answers: [
        { id: 139, answer: 'Egyptian Pound', isCorrect: true },
        { id: 140, answer: 'US Dollar', isCorrect: false },
        { id: 141, answer: 'Euro', isCorrect: false },
        { id: 142, answer: 'British Pound', isCorrect: false },
      ],
    },
    {
      id: 37,
      question: 'Which ancient wonder is located in Egypt?',
      explanation: 'The Great Pyramid of Giza is located in Egypt.',
      answers: [
        { id: 143, answer: 'Great Pyramid of Giza', isCorrect: true },
        { id: 144, answer: 'Hanging Gardens of Babylon', isCorrect: false },
        { id: 145, answer: 'Colossus of Rhodes', isCorrect: false },
        { id: 146, answer: 'Temple of Artemis', isCorrect: false },
      ],
    },
    {
      id: 38,
      question: 'What desert is Egypt part of?',
      explanation: 'Egypt is part of the Sahara Desert.',
      answers: [
        { id: 147, answer: 'Sahara', isCorrect: true },
        { id: 148, answer: 'Gobi', isCorrect: false },
        { id: 149, answer: 'Kalahari', isCorrect: false },
        { id: 150, answer: 'Mojave', isCorrect: false },
      ],
    },
    {
      id: 39,
      question: 'What is the population of Egypt (approx as of 2021)?',
      explanation:
        'The population of Egypt is approximately 100 million as of 2021.',
      answers: [
        { id: 151, answer: '100 million', isCorrect: true },
        { id: 152, answer: '50 million', isCorrect: false },
        { id: 153, answer: '150 million', isCorrect: false },
        { id: 154, answer: '200 million', isCorrect: false },
      ],
    },
    {
      id: 40,
      question: 'What is the predominant religion in Egypt?',
      explanation: 'The predominant religion in Egypt is Islam.',
      answers: [
        { id: 155, answer: 'Islam', isCorrect: true },
        { id: 156, answer: 'Christianity', isCorrect: false },
        { id: 157, answer: 'Judaism', isCorrect: false },
        { id: 158, answer: 'Hinduism', isCorrect: false },
      ],
    },
    {
      id: 41,
      question: 'What famous canal is located in Egypt?',
      explanation: 'The Suez Canal is located in Egypt.',
      answers: [
        { id: 159, answer: 'Suez Canal', isCorrect: true },
        { id: 160, answer: 'Panama Canal', isCorrect: false },
        { id: 161, answer: 'Kiel Canal', isCorrect: false },
        { id: 162, answer: 'Corinth Canal', isCorrect: false },
      ],
    },
    {
      id: 42,
      question: 'What is the national bird of Egypt?',
      explanation: 'The national bird of Egypt is the Steppe Eagle.',
      answers: [
        { id: 163, answer: 'Steppe Eagle', isCorrect: true },
        { id: 164, answer: 'Bald Eagle', isCorrect: false },
        { id: 165, answer: 'Golden Eagle', isCorrect: false },
        { id: 166, answer: 'Harpy Eagle', isCorrect: false },
      ],
    },
  ],
};

export const questionsEgypt: Question[] = quizEgypt.questions.map((entry) => {
  return {
    id: entry.id,
    question: entry.question,
    explanation: entry.explanation,
    choices: entry.answers.map((answer) => ({
      id: answer.id,
      text: answer.answer,
    })),
    answer: entry.answers.find((answer) => answer.isCorrect)!.id,
    status: 'unanswered',
    holidayId: 15,
  };
});
