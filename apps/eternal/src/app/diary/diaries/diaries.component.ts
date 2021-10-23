import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-diaries',
  templateUrl: './diaries.component.html',
  styleUrls: ['./diaries.component.scss']
})
export class DiariesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  declarations: [DiariesComponent],
  exports: [DiariesComponent]
})
export class DiariesComponentModule {}
