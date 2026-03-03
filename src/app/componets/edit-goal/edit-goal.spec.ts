import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoal } from './edit-goal';

describe('EditGoal', () => {
  let component: EditGoal;
  let fixture: ComponentFixture<EditGoal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGoal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGoal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
