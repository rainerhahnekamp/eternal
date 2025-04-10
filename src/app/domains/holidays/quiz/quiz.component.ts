import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { assertDefined } from '../../../shared/util/assert-defined';
import { QuizService } from './quiz.service';
import { AnswerStatus } from './model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  imports: [MatCardModule, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  readonly id = input.required({ transform: numberAttribute });
  protected readonly quiz = inject(QuizService).findById(this.id);

  status = computed(() => {
    const status: Record<AnswerStatus, number> = {
      unanswered: 0,
      correct: 0,
      incorrect: 0,
    };

    const quiz = this.quiz.value();
    if (!quiz) {
      return status;
    }

    for (const question of quiz.questions) {
      status[question.status]++;
    }

    return status;
  });

  protected handleAnswer(questionId: number, choiceId: number) {
    const quiz = this.quiz.value();
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

    this.quiz.value.update((value) =>
      value ? { ...value, questions } : value,
    );
  }
}
