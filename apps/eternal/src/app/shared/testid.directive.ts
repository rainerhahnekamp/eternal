import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { Configuration } from './configuration';

@Directive({
  selector: '[testid]',
  standalone: true
})
export class TestidDirective implements OnInit {
  @Input() testid = '';

  constructor(private el: ElementRef, private configuration: Configuration) {}

  ngOnInit(): void {
    const htmlElement = this.el.nativeElement as HTMLElement;
    htmlElement.removeAttribute('testid');
    if (this.configuration.useTestid) {
      htmlElement.setAttribute('data-testid', this.testid);
    }
  }
}
