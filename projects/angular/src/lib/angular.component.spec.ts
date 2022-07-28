import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularComponent } from './angular.component';
import { _expect as expect } from './expect';

describe('AngularComponent', () => {
  let component: AngularComponent;
  let fixture: ComponentFixture<AngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
