import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';

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
    @if (firstQuestion(); as question) {
      <p>{{ question.question }}</p>
      @for (answer of question.answers; track answer) {
        <button mat-raised-button (click)="handleAnswer(answer.id)">
          {{ answer.answer }}
        </button>
      }
      <p>Status: {{ status() }}</p>
    }
  `,
  standalone: true,
  imports: [MatButton],
})
export class QuizComponent {
  readonly #httpClient = inject(HttpClient);
  protected readonly status = signal<'correct' | 'incorrect' | 'unanswered'>(
    'unanswered',
  );

  readonly #quizResource = rxResource({
    loader: () =>
      this.#httpClient.get<Quiz>(
        'https://api.eternal-holidays.net/holiday/1/quiz',
      ),
  });
  protected readonly firstQuestion = computed(() => {
    const quiz = this.#quizResource.value();
    if (quiz) {
      return quiz.questions[0];
    } else {
      return undefined;
    }
  });

  handleAnswer(answerId: number) {
    const question = this.firstQuestion();
    if (question) {
      this.status.set(
        (question.answers.find((a) => a.id === answerId)?.isCorrect ?? false)
          ? 'correct'
          : 'incorrect',
      );
    }
  }
}
