import {Component, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {TaskWithGoal} from '../../models/viewModel/TaskWithGoal.interface';
import {GoalService} from '../../services/goal.service';
import {AsyncPipe} from '@angular/common';
import {TaskCard} from '../task-card/task-card';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, TaskCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  public todayTasks$!: Observable<TaskWithGoal[]>;
  public todayDate: string;
  public stats$!: Observable<{ total: number, completed: number, percentage: number }>;

  constructor(private _goalService: GoalService,
              private _router: Router) {
    const options: any = {weekday: 'long', day: 'numeric'};
    this.todayDate = new Intl.DateTimeFormat('en-US', options).format(new Date());
  }

  public ngOnInit(): void {
    this.todayTasks$ = this._goalService.getTodayTasks();
    this.stats$ = this.todayTasks$.pipe(
      map(tasks => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.isCompleted).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return {total, completed, percentage};
      })
    );
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
}
