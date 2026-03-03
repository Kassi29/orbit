import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {GoalService} from '../../services/goal.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-edit-goal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-goal.html',
  styleUrl: './edit-goal.scss',
})
export class EditGoal implements OnInit {
  @Input() goalId!: string;

  public goalForm!: FormGroup;
  private _fb = inject(FormBuilder);
  private _goalService = inject(GoalService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._initForm();
    this._loadGoalData();
  }

  private _initForm(): void {
    this.goalForm = this._fb.group({
      name: ['', Validators.required],
      color: ['#9333ea', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required]
    });
  }

  private _loadGoalData(): void {
    this._goalService.getGoalById(this.goalId)
      .pipe(take(1))
      .subscribe(goal => {
        if (goal) {
          this.goalForm.patchValue({
            name: goal.name,
            color: goal.color,
            startDay: goal.startDay,
            endDay: goal.endDay
          });
        }
      });
  }

  public onSave(): void {
    if (this.goalForm.invalid) return;

    this._goalService.updateGoal(this.goalId, this.goalForm.value);

    this.goBackToGoalDetail();
  }

  public goBackToGoalDetail(): void {
    this._router.navigate(['/goal-detail', this.goalId]);
  }
}
