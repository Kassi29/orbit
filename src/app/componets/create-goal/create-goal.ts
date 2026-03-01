import {Component, inject} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GoalService} from '../../services/goal.service';
import {TaskInitialData} from '../../models/viewModel/task-initial.data';
import {DAYS_IN_THE_WEEK} from '../../models/constants/days.constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-goal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-goal.html',
  styleUrl: './create-goal.scss',
  standalone: true
})
export class CreateGoal {

  private _formBuilder = inject(FormBuilder);
  private _goalService = inject(GoalService);
  private _router = inject(Router);

  public goalForm: FormGroup = this._formBuilder.group({
    color: ['#9333ea'],
    endDay: [new Date().toISOString().split('')[0]],
    name: ['', [Validators.required]],
    tasks: this._formBuilder.array<TaskInitialData>([]),
    startDay: [new Date().toISOString().split('')[0]]
  });

  public get tasks() {
    return this.goalForm.get('tasks') as FormArray;
  }

  protected readonly DAYS_IN_THE_WEEK = DAYS_IN_THE_WEEK;

  constructor() {
    this.addTask();
  }

  public addTask(): void {
    const goalStartDate = this.goalForm.get('startDay')?.value;
    const goalEndDate = this.goalForm.get('endDay')?.value;

    const taskForm: FormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      frequency: [[]],
      endDay: [goalEndDate, Validators.required],
      startDay: [goalStartDate, Validators.required]
    });

    console.warn("Se anadio un formulario de task");
    this.tasks.push(taskForm);
  }

  public onToggleDay(taskIndex: number, dayValue: number): void {
    const taskFrequency: AbstractControl | null = this.tasks.at(taskIndex).get('frequency');

    if (!taskFrequency) return;

    const currentTaskFrequency: number[] = taskFrequency.value || [];

    if (currentTaskFrequency.includes(dayValue)) {
      taskFrequency.setValue(this._deleteDay(currentTaskFrequency, dayValue));
    } else {
      taskFrequency.setValue([...currentTaskFrequency, dayValue]);
    }
  }

  public onSave(): void {
    if (this.goalForm.invalid) return;

    const {color, endDay, name, tasks, startDay} = this.goalForm.value;

    const newGoalId = this._goalService.addGoal({
      color: color,
      endDay: endDay,
      startDay: startDay,
      name: name
    });

    tasks.forEach((task: TaskInitialData) => {
      this._goalService.addTask({
        ...task,
        goalId: newGoalId,
        startDay: startDay,
        endDay: endDay
      })
    });

    this._resetForm();
    this._router.navigate(['/'])
  }

  private _deleteDay(currentTaskFrequency: number[], dayValue: number): number[] {
    return (currentTaskFrequency.filter(
      (day: number) => day !== dayValue
    ));
  }

  private _resetForm(): void {
    this.tasks.clear();

    this.goalForm.reset({
      color: ['#9333ea'],
      endDay: '',
      name: '',
      tasks: [],
      startDay: [new Date().toISOString().split('')[0]]
    })
  }
}
