import { Component } from '@angular/core';
import { TestidDirective } from '../../shared/testid.directive';

@Component({
  selector: 'eternal-diaries',
  templateUrl: './diaries.component.html',
  styleUrls: ['./diaries.component.scss'],
  imports: [TestidDirective],
  standalone: true
})
export class DiariesComponent {}
