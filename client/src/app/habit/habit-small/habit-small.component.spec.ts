import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitSmallComponent } from './habit-small.component';

describe('HabitSmallComponent', () => {
  let component: HabitSmallComponent;
  let fixture: ComponentFixture<HabitSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitSmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
