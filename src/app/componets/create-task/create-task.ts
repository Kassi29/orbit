import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {GoalService} from '../../services/goal.service';
import {DAYS_IN_THE_WEEK} from '../../models/constants/days.constants';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
  standalone: true
})
export class CreateTask implements OnInit {
  @Input() goalId!: string;

  public taskForm!: FormGroup;

  private _formBuilder = inject(FormBuilder);
  private _goalService = inject(GoalService);
  private _router = inject(Router);

  protected readonly DAYS_IN_THE_WEEK = DAYS_IN_THE_WEEK;

  public ngOnInit(): void {
    this._initTaskForm();
  }

  public onCreateTask(): void {
    if(this.taskForm.invalid) return;

    this._goalService.addTask({
      ...this.taskForm.value,
      goalId: this.goalId
    });

    this.goBackToDetail();
  }

  private _initTaskForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.taskForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      startDay: [new Date().toISOString().split('')[0]],
      endDay: [new Date().toISOString().split('')[0]],
      frequency: [[]]
    });
  }

  public onToggleDay(dayValue: number): void {
    const frequencyControl = this.taskForm.get('frequency');

    if (!frequencyControl) return;

    const currentTaskFrequency: number[] = frequencyControl.value || [];

    if (currentTaskFrequency.includes(dayValue)) {
      frequencyControl.setValue(this._deleteDay(currentTaskFrequency, dayValue));
    } else {
      frequencyControl.setValue([...currentTaskFrequency, dayValue]);
    }
  }

  public goBackToDetail(): void {
    this._router.navigate(['/goal-detail', this.goalId]);
  }

  private _deleteDay(currentTaskFrequency: number[], dayValue: number): number[] {
    return (currentTaskFrequency.filter(
      (day: number) => day !== dayValue
    ));
  }
}
