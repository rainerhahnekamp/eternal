import { Injectable, signal } from '@angular/core';
import { Holiday as Vacation } from '../../model/holiday';

abstract class FavouriteStore {
  protected readonly state = signal({
    favouriteIds: [] as number[],
  });

  constructor(newState: object) {
    this.state.update((value) => ({ ...value, ...newState }));
  }
}

abstract class LocalStorageStore extends FavouriteStore {
  save = () => void true;

  load = () => void true;
}

@Injectable({ providedIn: 'root' })
export class VacationStore extends LocalStorageStore {
  constructor() {
    super({
      vacations: [] as Vacation[],
      isLoaded: false,
    });
  }

  //   public readonly vacations = computed(() => this.state().vacations);
  //   public readonly isLoaded = computed(() => this.state().isLoaded);

  patchState(value: unknown) {
    // patch state logic...
  }
}
