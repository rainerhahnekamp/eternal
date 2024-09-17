import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Quiz, QuizApi } from "@app/holidays/feat-quiz/model";
import { firstValueFrom, map } from "rxjs";
import { toQuiz } from "@app/holidays/feat-quiz/to-quiz";

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly #httpClient = inject(HttpClient);

  findById(id: number): Promise<Quiz> {
    return firstValueFrom(
      this.#httpClient
        .get<QuizApi>(`/holiday/${id}/quiz`)
        .pipe(map(toQuiz)),
    );
  }
}
