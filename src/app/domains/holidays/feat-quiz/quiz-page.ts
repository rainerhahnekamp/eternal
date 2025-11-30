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
import { interval } from 'rxjs';
import { assertDefined } from '../../../shared/util/assert-defined';
import { AnswerStatus, Question } from './model';
import { QuizQuestion } from './quiz-question';
import { QuizStatusComponent } from './quiz-status';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ title() }}</h2>
    <app-quiz-status [timeLeft]="timeLeft()" [status]="status()" />
    @for (question of questions(); track question) {
      <app-quiz-question
        [question]="question"
        (answer)="handleAnswer($event)"
      ></app-quiz-question>
    }`,
  imports: [QuizStatusComponent, QuizQuestion],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  private quizService = inject(QuizService);

  // State signals
  protected readonly title = signal('');
  protected readonly questions = signal<Question[]>([]);
  protected readonly timeInSeconds = signal(60);
  protected readonly timeStarted = signal(new Date());
  protected readonly timeLeft = signal(0);

  // Computed status
  protected readonly status = computed(() => {
    const status: Record<AnswerStatus, number> = {
      unanswered: 0,
      correct: 0,
      incorrect: 0,
    };

    for (const question of this.questions()) {
      status[question.status]++;
    }

    return status;
  });

  id = input.required({ transform: numberAttribute });

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.#loadQuiz(id));
    });
    this.#startTimer();
  }

  #loadQuiz(id: number) {
    this.quizService.findById(id).then((quiz) => {
      this.title.set(quiz.title);
      this.questions.set(quiz.questions);
      this.timeInSeconds.set(quiz.timeInSeconds);
      this.timeStarted.set(new Date());
    });
  }

  #startTimer() {
    interval(1000).subscribe(() => {
      this.timeLeft.set(
        this.timeInSeconds() -
          Math.floor(
            (new Date().getTime() - this.timeStarted().getTime()) / 1000,
          ),
      );
    });
  }

  handleAnswer($event: { questionId: number; choiceId: number }) {
    const question = this.questions().find((q) => q.id === $event.questionId);
    assertDefined(question);

    this.questions.update((questions) =>
      questions.map((q) => {
        if (q.id === $event.questionId) {
          const status: AnswerStatus =
            q.answer === $event.choiceId ? 'correct' : 'incorrect';
          return { ...q, status };
        }
        return q;
      }),
    );
  }
}
