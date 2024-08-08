import { QuizComponent } from '@app/holidays/feature/quiz/quiz.component';
import { TestBed } from '@angular/core/testing';
import { within, screen } from '@testing-library/angular';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import userEvent from '@testing-library/user-event';
import { createQuiz } from '@app/holidays/feature/quiz/spec/create-quiz';
import { ui } from '@app/holidays/feature/quiz/spec/ui';

fdescribe('QuizComponent', () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            {
              path: 'quiz/:id',
              component: QuizComponent,
            },
          ],
          withComponentInputBinding(),
        ),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const httpCtrl = TestBed.inject(HttpTestingController);
    const user = userEvent.setup();
    const harness = await RouterTestingHarness.create('/quiz/1');
    harness.fixture.autoDetectChanges(true);

    httpCtrl
      .match((req) => Boolean(req.url.match('holiday/1/quiz')))[0]
      .flush(createQuiz(1));
    httpCtrl.verify();
    await screen.findByText('Angular Quiz');

    return { httpCtrl, user, harness };
  };

  it('should answer one question correctly', async () => {
    const { user } = await setup();
    const question1 = await ui.question(
      'What programming language is Angular written in?',
    );
    await user.click(within(question1).getByText('TypeScript'));

    expect(await ui.correctStatus()).toBe('Correct: 1');
    expect(await ui.incorrectStatus()).toBe('Incorrect: 0');
  });

  it('should answer one question incorrectly', async () => {
    const { user } = await setup();
    const question1 = await ui.question(
      'What programming language is Angular written in?',
    );
    await user.click(within(question1).getByText('Java'));

    expect(await ui.correctStatus()).toBe('Correct: 0');
    expect(await ui.incorrectStatus()).toBe('Incorrect: 1');
  });

  it('should run out of time after 2 seconds', async () => {
    await setup();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(await screen.findByText('Time is up!')).toBeTruthy();
  });
});
