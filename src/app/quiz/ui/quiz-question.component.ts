import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Question } from '../model/model';
import { QuizService } from '../data/quiz.service';

@Component({
  selector: 'app-quiz-question',
  imports: [MatButton],
  template: `
    <div
      class="max-sm block p-6 bg-white border border-gray-200 rounded-lg shadow my-4"
    >
      <h3>{{ question().question }}</h3>
      <div class="grid grid-cols-2 gap-4">
        @for (answer of question().answers; track answer) {
          <button mat-raised-button (click)="handleAnswer(answer.id)">
            {{ answer.answer }}
          </button>
        }
      </div>
      <p>Status: {{ status() }}</p>
    </div>
  `,
})
export class QuizQuestionComponent {
  readonly question = input.required<Question>();
  readonly status = input.required<string>();
  answered = output<number>();

  readonly quizService = inject(QuizService);

  handleAnswer(id: number) {
    this.quizService.handleAnswer(this.question(), id);
  }
}
