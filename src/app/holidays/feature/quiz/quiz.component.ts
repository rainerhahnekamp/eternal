import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { AnswerStatus, Question, Quiz } from '@app/holidays/feature/quiz/model';
import { MatButton } from '@angular/material/button';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { DatePipe, getLocaleCurrencyName, JsonPipe, NgClass } from "@angular/common";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { assertDefined } from '@app/shared/util';
import { QuizStatusComponent } from './ui/quiz-status.component';
import { QuizQuestionComponent } from './ui/quiz-question.component';

@Component({
    selector: 'app-quiz',
    template: `
    <h2>{{ title() }}</h2>
    <app-quiz-status [status]="status" />

    @let question = currentQuestion();
    @if (question) {
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
    imports: [
        MatButton,
        NgClass,
        MatCard,
        MatCardHeader,
        MatCardActions,
        MatCardContent,
        JsonPipe,
        QuizStatusComponent,
        QuizQuestionComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent {
  id = input.required({ transform: numberAttribute });

  quizService = inject(QuizService);
  quiz = signal<Quiz>({ title: '', questions: [], timeInSeconds: 180 });
  questions = computed(() => this.quiz().questions);
  title = computed(() => this.quiz().title);

  currentQuestionIx = signal(0);
  currentQuestion = computed<Question | undefined>(
    (quiz = this.quiz(), currentQuestionIx = this.currentQuestionIx()) =>
      quiz.questions[currentQuestionIx],
  );

  hasNextQuestion = computed(
    (quiz = this.quiz(), currentQuestionIx = this.currentQuestionIx()) => {
      return currentQuestionIx < quiz.questions.length - 1;
    },
  );

  isNextButtonDisabled = computed(
    (
      hasNextQuestion = this.hasNextQuestion(),
      currentQuestion = this.currentQuestion(),
    ) => !hasNextQuestion || (currentQuestion?.status === 'unanswered')
  );

  nextQuestion() {
    this.currentQuestionIx.update((value) => value + 1);
  }

  status: Record<AnswerStatus, number> = {
    unanswered: 0,
    correct: 0,
    incorrect: 0,
  };

  constructor() {
    effect(async () => {
      const id = this.id();
      untracked(() => this.loadQuiz(id));
    });
  }

  private async loadQuiz(id: number) {
    const quiz = await this.quizService.findById(id);
    this.quiz.set(quiz);
  }

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
