import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {TaskWithGoal} from '../../models/viewModel/TaskWithGoal.interface';
import {IdentifyTaskData} from '../../models/identifyTask.data';
import {NgClass} from '@angular/common';

@Component({
  selector: '' +
    'app-task-card',
  imports: [
    NgClass
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  standalone: true
})
export class TaskCard {

  public isOpenDropDown: boolean;

  @Input({required: true}) task!: TaskWithGoal;

  @Output() editTaskEmitter: EventEmitter<IdentifyTaskData>;
  @Output() deleteTaskEmitter: EventEmitter<IdentifyTaskData>;
  @Output() toggleStatusEmitter: EventEmitter<string>;

  constructor(private _elementRef: ElementRef) {
    this.deleteTaskEmitter = new EventEmitter<IdentifyTaskData>();
    this.editTaskEmitter = new EventEmitter<IdentifyTaskData>();
    this.toggleStatusEmitter = new EventEmitter<string>();
    this.isOpenDropDown = false;
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (this.isOpenDropDown && !this._elementRef.nativeElement.contains(event.target)) {
      this.toggleDropDown();
    }
  }

  public deleteTask(event: MouseEvent, taskId: string, goalId: string): void {
    event.stopPropagation();

    this.deleteTaskEmitter.emit({taskId: taskId, goalId: goalId});
  }

  public editTask(event: MouseEvent, taskId: string, goalId: string): void {
    event.stopPropagation();

    this.editTaskEmitter.emit({taskId: taskId, goalId: goalId});
  }

  public onCheckTask(): void {
    this.toggleStatusEmitter.emit(this.task.id);
  }

  public toggleDropDown(): void {
    this.isOpenDropDown = !this.isOpenDropDown;
  }
}
