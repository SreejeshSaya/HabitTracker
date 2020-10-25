import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsPublicComponent } from './user-details-public.component';

describe('UserDetailsPublicComponent', () => {
  let component: UserDetailsPublicComponent;
  let fixture: ComponentFixture<UserDetailsPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailsPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
