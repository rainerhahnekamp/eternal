import { signalStoreFeature, withState } from '@ngrx/signals';
import { Question } from '../model';

export interface QuizState {
  title: string;
  questions: Question[];
}

const initialState: QuizState = {
  title: '',
  questions: [],
};

export function withQuizState<_>() {
  return signalStoreFeature(withState(initialState));
}
