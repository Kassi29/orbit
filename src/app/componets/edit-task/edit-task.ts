import {Component, inject, Input, OnInit} from '@angular/core';
import {GoalService} from '../../services/goal.service';
import {Task} from '../../models/task.interface';
import {take} from 'rxjs';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DAYS_IN_THE_WEEK} from '../../models/constants/days.constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-task',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.scss',
})
export class EditTask implements OnInit {

  @Input() goalId!: string;
  @Input() taskId!: string;

  public task?: Task;
  public taskForm!: FormGroup;

  private _formBuilder = inject(FormBuilder);
  private _goalService = inject(GoalService);
  private _router = inject(Router);

  protected readonly DAYS_IN_THE_WEEK = DAYS_IN_THE_WEEK;

  public ngOnInit(): void {
    this._getTaskInformation();
  }

  public onUpdateTask(): void {
    if (this.taskForm.invalid) return;

    this._goalService.updateTask(this.goalId, this.taskId, this.taskForm.value);

    this.goBackToDashboard();
  }

  public goBackToDashboard(): void {
    this._router.navigate(['/']);
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

  private _deleteDay(currentTaskFrequency: number[], dayValue: number): number[] {
    return (currentTaskFrequency.filter(
      (day: number) => day !== dayValue
    ));
  }

  private _getTaskInformation(): void {
    this._goalService.getTaskData({goalId: this.goalId, taskId: this.taskId}).pipe(
      take(1)).subscribe((task: Task | undefined) => {
      if (!task) return;

      this.task = task;

      this.taskForm = this._formBuilder.group({
        name: [task.name, Validators.required],
        startDay: [task.startDay, Validators.required],
        endDay: [task.endDay, Validators.required],
        frequency: [task.frequency || []]
      })
    });
  }
}
