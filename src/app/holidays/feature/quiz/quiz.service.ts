import { HttpClient } from '@angular/common/http';
import { inject, Injectable, WritableSignal } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { AnswerStatus, Quiz } from './model';

export interface QuizApi {
  id: number;
  title: string;
  timeInSeconds: number;
  questions: {
    id: number;
    question: string;
    explanation: string;
    answers: { id: number; answer: string; isCorrect: boolean }[];
  }[];
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly #httpClient = inject(HttpClient);

  findById(id: number): Promise<Quiz> {
    return lastValueFrom(
      this.#httpClient.get<QuizApi>(`/holiday/${id}/quiz`).pipe(map(toQuiz)),
    );
  }

  answerQuestion(
    quiz: WritableSignal<Quiz>,
    questionId: number,
    answerId: number,
  ) {
    quiz.update((quiz) => {
      const questions = quiz.questions.map((question) => {
        if (question.id === questionId) {
          const status: AnswerStatus =
            question.answer === answerId ? 'correct' : 'incorrect';
          return {
            ...question,
            status: status,
          };
        } else {
          return question;
        }
      });

      return { ...quiz, questions };
    });
  }
}

function toQuiz(quiz: QuizApi, holidayId: number): Quiz {
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
