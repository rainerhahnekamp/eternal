import { Component, inject } from '@angular/core';
import { QuizProgressComponent } from '../ui/quiz-progress.component';
import { Question } from '../model/model';
import { QuizQuestionComponent } from '../ui/quiz-question.component';
import { QuizService } from '../data/quiz.service';
import { UserService } from "../../shared/user.service";
import { BookingInfoService } from "../../booking/api/booking-info.service";

@Component({
  selector: 'app-quiz',
  template: `
    @if (quizResource.value(); as quiz) {
      <h2>{{ quiz.title }}</h2>
      <app-quiz-progress [progress]="progress()" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (question of quiz.questions; track question) {
          <app-quiz-question
            [question]="question"
            [status]="status()[question.id]"
            (answered)="handleAnswer(question, $event)"
          />
        }
      </div>
    }
  `,
  standalone: true,
  imports: [QuizProgressComponent, QuizQuestionComponent],
})
export class QuizComponent {
  readonly quizService = inject(QuizService);
  readonly userService = inject(UserService);
  readonly bookingInfo = inject(BookingInfoService);

  protected readonly quizResource = this.quizService.quizResource;
  protected readonly status = this.quizService.status;
  protected readonly progress = this.quizService.progress;


  handleAnswer(question: Question, answerId: number) {
    this.quizService.handleAnswer(question, answerId);
  }
}
