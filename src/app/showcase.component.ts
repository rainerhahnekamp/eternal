import { Component, computed, effect, signal, untracked } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { BehaviorSubject, map } from "rxjs";

@Component({
  selector: 'app-showcase',
  template: `{{double() }}`,
  standalone: true,
  imports: [AsyncPipe],
})
export default class ShowcaseComponent {
  n = signal(1)
  double = computed(() => this.n() * 2)
}
