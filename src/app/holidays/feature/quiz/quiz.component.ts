import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AnswerStatus, Question, Quiz } from '@app/holidays/feature/quiz/model';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';

import { assertDefined } from '@app/shared/util';
import { QuizQuestionComponent } from './ui/quiz-question.component';
import { QuizStatusComponent } from './ui/quiz-status.component';

const emptyQuiz: Quiz = { title: '', questions: [], timeInSeconds: 60 };

@Component({
  selector: 'app-quiz',
  template: `
    <h2>{{ quiz().title }}</h2>
    <app-quiz-status [status]="status()" />

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
  quiz = signal(emptyQuiz);

  constructor() {
    effect(() => {
      const id = this.id();

      void untracked(async () =>
        this.quiz.set(await this.quizService.findById(id)),
      );
    });
  }

  currentQuestionIx = signal(0);
  currentQuestion = computed<Question | undefined>(
    () => this.quiz().questions[this.currentQuestionIx()],
  );

  isNextButtonDisabled = linkedSignal(() => {
    this.currentQuestion();
    return true;
  });

  status = computed(() => {
    const status: Record<AnswerStatus, number> = {
      unanswered: 0,
      correct: 0,
      incorrect: 0,
    };

    for (const question of this.quiz().questions) {
      status[question.status]++;
    }

    return status;
  });

  // Logic
  nextQuestion() {
    this.currentQuestionIx.update((value) => value + 1);
  }

  answer(questionId: number, answerId: number) {
    const question = this.quiz().questions.find(
      (question) => question.id === questionId,
    );
    assertDefined(question);
    this.quizService.answerQuestion(this.quiz, questionId, answerId);

    this.isNextButtonDisabled.set(false);
  }
}
