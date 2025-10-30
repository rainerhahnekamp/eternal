import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'dummy',
  template: `<h1>Hallo from {{ title() }}</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class DummyComponent implements OnInit {
  @Input() title: string | undefined;

  constructor() {}

  ngOnInit() {}
  httpClient = inject(HttpClient, { skipSelf: true });
}
