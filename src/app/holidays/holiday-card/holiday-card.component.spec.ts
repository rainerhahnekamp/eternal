import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayCardComponent } from './holiday-card.component';

describe('HolidayCardComponent', () => {
  let component: HolidayCardComponent;
  let fixture: ComponentFixture<HolidayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
