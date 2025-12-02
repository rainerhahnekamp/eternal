import { signalStoreFeature, withState } from '@ngrx/signals';
import { Question } from '../model';
import { withCountdown } from '../with-countdown';

export interface QuizState {
  title: string;
  questions: Question[];
}

const initialState: QuizState = {
  title: '',
  questions: [],
};

export function withQuizState<_>() {
  return signalStoreFeature(withCountdown(60), withState(initialState));
}
