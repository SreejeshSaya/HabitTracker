import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitManageComponent } from './habit-manage.component';

describe('HabitManageComponent', () => {
  let component: HabitManageComponent;
  let fixture: ComponentFixture<HabitManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
