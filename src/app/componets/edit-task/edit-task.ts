import {Component, inject, Input, OnInit} from '@angular/core';
import {GoalService} from '../../services/goal.service';
import {Task} from '../../models/task.interface';
import {take} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DAYS_IN_THE_WEEK} from '../../models/constants/days.constants';

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

  constructor(private _goalService: GoalService) {
  }

  public ngOnInit(): void {
    this._getTaskInformation();
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
      if (task) {
        this.task = task;

        this.taskForm = this._formBuilder.group({
          name: [task.name, Validators.required],
          startDay: [task.startDay, Validators.required],
          endDay: [task.endDay, Validators.required],
          frequency: [task.frequency || []]
        });

      } else {
        console.error('We cannot find your task :C')
      }
    });
  }

  protected readonly DAYS_IN_THE_WEEK = DAYS_IN_THE_WEEK;
}
