import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  PendingTasks,
  resource,
  signal,
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
    @let quiz = quizResource.value();
    <h2>{{ quiz.title }}</h2>
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
  pendingTasks = inject(PendingTasks);

  quizService = inject(QuizService);
  quizResource = resource({
    request: this.id,
    defaultValue: emptyQuiz,
    loader: () => this.quizService.findById(this.id()),
  });

  //region UI
  currentQuestionIx = signal(0);
  currentQuestion = computed<Question | undefined>(
    () => this.quizResource.value().questions[this.currentQuestionIx()],
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

    for (const question of this.quizResource.value().questions) {
      status[question.status]++;
    }

    return status;
  });
  //endregion

  // Logic
  nextQuestion() {
    this.currentQuestionIx.update((value) => value + 1);
  }

  answer(questionId: number, answerId: number) {
    const question = this.quizResource
      .value()
      .questions.find((question) => question.id === questionId);
    assertDefined(question);
    this.quizService.answerQuestion(
      this.quizResource.value,
      questionId,
      answerId,
    );

    const done = this.pendingTasks.add();
    setTimeout(() => {
      this.isNextButtonDisabled.set(false);
      done();
    }, 1000);
  }
}
