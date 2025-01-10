import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Question, Quiz } from '../model/model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly #httpClient = inject(HttpClient);
  readonly status = signal<
    Record<number, 'correct' | 'incorrect' | 'unanswered'>
  >({});

  readonly progress = computed(() => {
    const quiz = this.quizResource.value();
    if (!quiz) {
      return 0;
    }
    const questionCount = quiz.questions.length;
    const answeredCount = Object.keys(this.status()).length;

    return (answeredCount / questionCount) * 100;
  });

  readonly quizResource = rxResource({
    loader: () =>
      this.#httpClient.get<Quiz>(
        'https://api.eternal-holidays.net/holiday/1/quiz',
      ),
  });

  handleAnswer(question: Question, answerId: number) {
    this.status.update((status) => ({
      ...status,
      [question.id]:
        (question.answers.find((a) => a.id === answerId)?.isCorrect ?? false)
          ? 'correct'
          : 'incorrect',
    }));
  }
}
