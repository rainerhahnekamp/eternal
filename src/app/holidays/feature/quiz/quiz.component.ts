import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AnswerStatus, Question, Quiz } from '@app/holidays/feature/quiz/model';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';

import { rxResource } from '@angular/core/rxjs-interop';
import { assertDefined } from '@app/shared/util';
import { QuizQuestionComponent } from './ui/quiz-question.component';
import { QuizStatusComponent } from './ui/quiz-status.component';

const emptyQuiz: Quiz = { title: '', questions: [], timeInSeconds: 60 };

@Component({
  selector: 'app-quiz',
  template: `
    <h2>{{ title() }}</h2>
    <app-quiz-status [status]="status" />

    @if (currentQuestion(); as question) {
      <app-quiz-question
        [question]="question"
        (answer)="answer(question.id, $event)"
      />
    }

    <button
      mat-raised-button
      [disabled]="isNextButtonDisabled()"
      (click)="nextQuestion()"
    >
      Next Question
    </button>
  `,
  imports: [MatButton, QuizStatusComponent, QuizQuestionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  id = input.required({ transform: numberAttribute });

  quizService = inject(QuizService);

  // Data State
  quizResource = rxResource({
    request: () => this.id(),
    loader: (options) => {
      const id = options.request;
      return this.quizService.findById(id);
    },
  });

  quiz = linkedSignal(() => this.quizResource.value() || emptyQuiz);
  title = computed(() => this.quiz().title);
  questions = computed(() => this.quiz().questions);

  // UI State
  currentQuestionIx = signal(0);
  currentQuestion = computed<Question | undefined>(
    () => this.quiz().questions[this.currentQuestionIx()],
  );

  hasNextQuestion = computed(
    () => this.currentQuestionIx() < this.quiz().questions.length - 1,
  );

  isNextButtonDisabled = linkedSignal(() => {
    this.currentQuestion();
    return !this.hasNextQuestion;
  });

  // Logic
  nextQuestion() {
    this.currentQuestionIx.update((value) => value + 1);
  }

  status: Record<AnswerStatus, number> = {
    unanswered: 0,
    correct: 0,
    incorrect: 0,
  };

  answer(questionId: number, choiceId: number) {
    const question = this.questions().find(
      (question) => question.id === questionId,
    );
    assertDefined(question);

    this.quiz.update((quiz) => {
      const questions = this.quiz().questions.map((question) => {
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

      return { ...quiz, questions };
    });

    this.updateStatus();
  }

  private updateStatus() {
    this.status = { correct: 0, incorrect: 0, unanswered: 0 };
    for (const question of this.questions()) {
      this.status[question.status]++;
    }
  }
}
