import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  signal,
} from '@angular/core';

import { QuizStore } from './data/quiz-store';
import { z } from 'zod';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ quiz.value().name }}</h2> `,
  providers: [QuizStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  id = input.required({ transform: numberAttribute });

  quizSchema = z.object({
    name: z.string(),
    timeInSeconds: z.number(),
  });

  isQuizActive = signal(false);
  quiz = httpResource(
    () => (this.isQuizActive() ? `someurl/${this.id()}` : undefined),
    {
      parse: this.quizSchema.parse,
      defaultValue: { name: '', timeInSeconds: 0 },
    },
  );

  refresh() {
    this.isQuizActive.set(true);
    this.quiz.reload();
  }
}
