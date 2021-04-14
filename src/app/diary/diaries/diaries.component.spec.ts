import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiariesComponent } from './diaries.component';

describe('DiariesComponent', () => {
  let component: DiariesComponent;
  let fixture: ComponentFixture<DiariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
