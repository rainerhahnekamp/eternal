import { computed, inject, Injectable, signal } from '@angular/core';
import { QuizService } from './internal/quiz.service';
import { AnswerStatus } from '../model/model';
import { assertDefined } from '../../../../shared/util/assert-defined';

@Injectable({ providedIn: 'root' })
export class QuizStore {
  readonly #quizService = inject(QuizService);
  readonly #id = signal(0);

  readonly #quizResource = this.#quizService.findById(this.#id);

  readonly quiz = computed(() => {
    if (!this.#quizResource.hasValue()) {
      return undefined;
    }

    return this.#quizResource.value();
  });

  setId(id: number) {
    this.#id.set(id);
  }

  readonly status = computed(() => {
    const status: Record<AnswerStatus, number> = {
      unanswered: 0,
      correct: 0,
      incorrect: 0,
    };

    const quiz = this.#quizResource.value();
    if (!quiz) {
      return status;
    }

    for (const question of quiz.questions) {
      status[question.status]++;
    }

    return status;
  });

  handleAnswer(questionId: number, choiceId: number) {
    const quiz = this.#quizResource.value();
    assertDefined(quiz);

    const question = quiz.questions.find(
      (question) => question.id === questionId,
    );
    assertDefined(question);

    const questions = quiz.questions.map((question) => {
      if (question.id === questionId) {
        const status: AnswerStatus =
          question.answer === choiceId ? 'correct' : 'incorrect';
        return {
          ...question,
          status,
        };
      } else {
        return question;
      }
    });

    this.#quizResource.value.update((value) =>
      value ? { ...value, questions } : value,
    );
  }
}
