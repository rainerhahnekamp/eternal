import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

interface Question {
  id: number;
  question: string;
  answers: { id: number; answer: string; isCorrect: boolean }[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

@Component({
  selector: 'app-quiz',
  template: `
    @if (quizResource.value(); as quiz) {
      <h2>{{ quiz.title }}</h2>
      <div>
        <mat-progress-bar
          mode="determinate"
          [value]="progress()"
        ></mat-progress-bar>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (question of quiz.questions; track question) {
          <div
            class="max-sm block p-6 bg-white border border-gray-200 rounded-lg shadow my-4"
          >
            <h3>{{ question.question }}</h3>
            <div class="grid grid-cols-2 gap-4">
              @for (answer of question.answers; track answer) {
                <button
                  mat-raised-button
                  (click)="handleAnswer(question, answer.id)"
                >
                  {{ answer.answer }}
                </button>
              }
            </div>
            <p>Status: {{ status()[question.id] }}</p>
          </div>
        }
      </div>
    }
  `,
  standalone: true,
  imports: [MatButton, MatProgressBar],
})
export class QuizComponent {
  readonly #httpClient = inject(HttpClient);
  protected readonly status = signal<
    Record<number, 'correct' | 'incorrect' | 'unanswered'>
  >({});

  protected readonly progress = computed(() => {
    const quiz = this.quizResource.value();
    if (!quiz) {
      return 0;
    }
    const questionCount = quiz.questions.length;
    const answeredCount = Object.keys(this.status()).length;

    return (answeredCount / questionCount) * 100;
  });

  protected readonly quizResource = rxResource({
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
