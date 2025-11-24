import { TestBed } from '@angular/core/testing';
import { QuizStatusComponent } from './quiz-status';
import { inputBinding, provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { page } from 'vitest/browser';

describe('Quiz Status', () => {
  it('should show the time left', async () => {
    const fixture = TestBed.createComponent(QuizStatusComponent);

    fixture.componentRef.setInput('timeLeft', 10);
    fixture.componentRef.setInput('status', { correct: 0, incorrect: 0 });

    await expect
      .element(page.getByLabelText('Time remaining'))
      .toHaveTextContent('Time Left: 10 seconds');
  });

  it('should show the time left via new outputs', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(QuizStatusComponent, {
      bindings: [
        inputBinding('timeLeft', () => 10),
        inputBinding('status', () => ({ correct: 0, incorrect: 0 })),
      ],
    });

    await expect
      .element(page.getByLabelText('Time remaining'))
      .toHaveTextContent('Time Left: 10 seconds');
  });
});
