import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {TaskCard} from '../task-card/task-card';
import {Router, RouterLink} from '@angular/router';
import {Observable} from 'rxjs';
import {Goal} from '../../models/goal.interface';
import {Task} from '../../models/task.interface';
import {GoalService} from '../../services/goal.service';
import {TaskWithGoal} from '../../models/viewModel/TaskWithGoal.interface';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [AsyncPipe, TaskCard, RouterLink, CommonModule],
  templateUrl: './goal-detail.html',
  styleUrl: './goal-detail.scss',
})
export class GoalDetail implements OnInit {

  @Input() goalId!: string;

  public goal$!: Observable<Goal | undefined>;
  public tasks$!: Observable<TaskWithGoal[]>;

  private _goalService = inject(GoalService);
  private _router = inject(Router);

  public ngOnInit(): void {
    this.goal$ = this._goalService.getGoalById(this.goalId);
    this.tasks$ = this._goalService.getTasksByGoalId(this.goalId);
  }

  public onCheckTask(taskId: string): void {
    this._goalService.onToggleTask(taskId);
  }

  public onEditTask(data: { taskId: string, goalId: string }): void {
    this._router.navigate(['/edit-task', data.goalId, data.taskId]);
  }

  public onDeleteTask(data: { taskId: string, goalId: string }): void {
    this._goalService.deleteTask(data.taskId, data.goalId);
  }

  public onDeleteGoal(): void {
    this._goalService.deleteGoal(this.goalId);
  }
}
