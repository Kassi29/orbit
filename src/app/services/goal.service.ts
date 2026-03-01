import {Injectable} from '@angular/core';
import {Goal} from '../models/goal.interface';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import {Task} from '../models/task.interface';
import {MOCK_GOALS} from '../mock.data';
import {TaskWithGoal} from '../models/viewModel/TaskWithGoal.interface';
import {DailyEntryInterface} from '../models/daily-entry.interface';
import {GoalInitialData} from '../models/viewModel/goal.initial.data';
import {TaskInitialData} from '../models/viewModel/task-initial.data';
import {IdentifyTaskData} from '../models/identifyTask.data';

@Injectable({
  providedIn: 'root',
})
export class GoalService {

  public goals$!: Observable<Goal[]>;

  private _entries!: BehaviorSubject<DailyEntryInterface[]>;
  private _goals!: BehaviorSubject<Goal[]>;

  private readonly _todayDate: string;

  constructor() {
    this._todayDate = new Date().toISOString().split('T')[0];
    this._loadFromLocalStorage();
  }

  public addGoal(initialData: GoalInitialData): string {
    const newGoal: Goal = this._buildNewGoal(initialData);

    this._persistGoals([...this._goals.value, newGoal]);

    return newGoal.id;
  }

  public addTask(initialData: TaskInitialData): void {
    const newTask: Task = this._buildNewTask(initialData);

    const updatedGoals: Goal[] = this._goals.value.map((goal: Goal) => {
      if (goal.id === newTask.goalId) {
        return {
          ...goal,
          tasks: [...goal.tasks, newTask]
        }
      }
      return goal;
    });

    this._persistGoals(updatedGoals);
  }

  public deleteGoal(goalId: string): void {
    const updatedGoals: Goal[] = this._goals.value.filter((goal: Goal) => {
        return goal.id !== goalId;
      }
    );

    this._persistGoals(updatedGoals);
  }

  public deleteTask(taskId: string, goalId: string): void {
    const updatedGoals: Goal[] = this._goals.value.map((goal: Goal) => {
      if (goal.id === goalId) {
        const updatedTasks: Task[] = goal.tasks.filter((task: Task) => {

          return task.id !== taskId;
        });

        return {...goal, tasks: updatedTasks}
      }

      return goal;
    });

    this._persistGoals(updatedGoals);
  }

  public getTodayTasks(): Observable<TaskWithGoal[]> {
    return combineLatest([this.goals$, this._entries.asObservable()]).pipe(
      map(([allGoals, allEntries]: [Goal[], DailyEntryInterface[]]) => {
        const today: number = new Date().getDay();
        let tasksForToday: TaskWithGoal[] = [];

        allGoals.forEach((goal: Goal) => {
          goal.tasks.forEach((task: Task) => {

            if (task.frequency.includes(today) && this._isInsideTimeRange(task.startDay, task.endDay)) {

              const isDone: boolean = this._isTaskDone(allEntries, task.id);

              const taskWithDetails: TaskWithGoal = {
                ...task,
                isCompleted: isDone,
                goalColor: goal ? goal.color : 'No color',
                goalName: goal ? goal.name : 'No goal'
              }


              tasksForToday.push(taskWithDetails);
            }
          });
        });

        return tasksForToday;
      })
    );
  }

  public getGoalById(goalId: string): Observable<Goal | undefined> {
    return this.goals$.pipe(
      map((allGoals: Goal[]) => allGoals.find((goal: Goal) => goal.id === goalId)));
  }

  public getTasksByGoalId(goalId: string): Observable<TaskWithGoal[]> {
    return combineLatest([this.goals$, this._entries.asObservable()]).pipe(
      map(([allGoals, allEntries]: [Goal[], DailyEntryInterface[]]) => {
        const goal: Goal | undefined = allGoals.find((goal: Goal) => goal.id === goalId);

        if (!goal) return [];

        return goal.tasks.map((task: Task): TaskWithGoal => {
          return {
            ...task,
            isCompleted: this._isTaskDone(allEntries, task.id),
            goalColor: goal.color,
            goalName: goal.name
          };
        });
      })
    );
  }

  public updateGoal(goalId: string, updatedData: Goal): void {
    const updatedGoals: Goal[] = this._goals.value.map((goal: Goal) => {
      if (goal.id !== goalId) return goal;

      return {...goal, ...updatedData}
    });

    this._persistGoals(updatedGoals);
  }

  public getTaskData(data: IdentifyTaskData): Observable<Task | undefined> {
    return this.goals$.pipe(
      map((allGoals: Goal[]) => {
        const goal: Goal | undefined = allGoals.find((goal: Goal) => goal.id === data.goalId);

        if (!goal) {
          return undefined;
        }

        return goal.tasks.find((task: Task) => task.id === data.taskId);
      })
    );
  }

  public onToggleTask(taskId: string): void {
    const currentEntries = this._entries.value;

    const taskIndex = this._getTaskIndex(currentEntries, taskId);
    const isTaskCompleted = taskIndex > -1;

    const newEntries: DailyEntryInterface[] = isTaskCompleted ? this._removeEntry(currentEntries, taskId) : this._addNewEntry(currentEntries, taskId);

    this._persistEntries(newEntries);
  }

  public updateTask(goalId: string, taskId: string, updatedData: Task): void {
    const updatedGoals = this._goals.value.map((goal: Goal) => {
      if (goal.id !== goalId) return goal;

      const updatedTasks: Task[] = goal.tasks.map((task: Task) => {
        return task.id === taskId ? {...task, ...updatedData} : task;
      });

      return {...goal, tasks: updatedTasks};
    });

    this._persistGoals(updatedGoals);
  }

  private _addNewEntry(currentEntries: DailyEntryInterface[], taskId: string): DailyEntryInterface[] {
    const newEntry: DailyEntryInterface = {taskId, date: this._todayDate, id: crypto.randomUUID()};

    return [...currentEntries, newEntry];
  }

  private _buildNewGoal(initialData: GoalInitialData): Goal {
    return {
      id: crypto.randomUUID(),
      color: initialData.color,
      endDay: initialData.endDay,
      name: initialData.name,
      startDay: initialData.startDay,
      tasks: []
    }
  }

  private _buildNewTask(initialData: TaskInitialData): Task {
    return {
      endDay: initialData.endDay,
      id: crypto.randomUUID(),
      isCompleted: false,
      goalId: initialData.goalId,
      frequency: initialData.frequency,
      name: initialData.name,
      startDay: initialData.startDay
    };
  }

  private _getTaskIndex(entries: DailyEntryInterface[], taskId: string): number {
    return entries.findIndex(
      (entries: DailyEntryInterface) => {
        return entries.taskId === taskId && entries.date.split('T')[0] === this._todayDate;
      }
    );
  }

  private _isInsideTimeRange(startDay: string, endDay: string): boolean {

    return this._todayDate >= startDay && this._todayDate <= endDay;
  }

  private _isTaskDone(allEntries: DailyEntryInterface[], taskId: string) {
    return allEntries.some((entries: DailyEntryInterface) => {
      const entriesDate: string = entries.date.split('T')[0];

      return entries.taskId === taskId && (entriesDate === this._todayDate);
    });
  }

  private _loadFromLocalStorage(): void {
    const savedGoals = localStorage.getItem('goals');
    const savedEntries = localStorage.getItem('entries');

    const initialGoals = savedGoals ? JSON.parse(savedGoals) : MOCK_GOALS;
    const initialEntries = savedEntries ? JSON.parse(savedEntries) : [];

    this._entries = new BehaviorSubject<DailyEntryInterface[]>(initialEntries);
    this._goals = new BehaviorSubject<Goal[]>(initialGoals);
    this.goals$ = this._goals.asObservable();
  }

  private _persistEntries(updatedEntries: DailyEntryInterface[]): void {
    this._entries.next(updatedEntries);
    this._saveToLocalStorage();
  }

  private _persistGoals(updatedGoals: Goal[]) {
    this._goals.next(updatedGoals);
    this._saveToLocalStorage();
  }

  private _removeEntry(currentEntries: DailyEntryInterface[], taskId: string): DailyEntryInterface[] {
    return currentEntries.filter((entry: DailyEntryInterface) =>
      !(entry.taskId === taskId && entry.date.split('T')[0] === this._todayDate))
  }

  private _saveToLocalStorage(): void {
    localStorage.setItem('goals', JSON.stringify(this._goals.value));
    localStorage.setItem('entries', JSON.stringify(this._entries.value));
  }
}
