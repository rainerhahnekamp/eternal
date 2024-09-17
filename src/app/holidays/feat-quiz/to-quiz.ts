import { Quiz, QuizApi } from "@app/holidays/feat-quiz/model";

export function toQuiz(quiz: QuizApi, holidayId: number): Quiz {
  return {
    title: quiz.title,
    timeInSeconds: quiz.timeInSeconds,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      holidayId,
      question: question.question,
      explanation: question.explanation,
      status: 'unanswered',
      answer: question.answers.find((answer) => answer.isCorrect)!.id,
      choices: question.answers.map((answer) => ({
        id: answer.id,
        text: answer.answer,
      })),
    })),
  };
}
