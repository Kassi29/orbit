import {Task} from '../task.interface';

export interface TaskWithGoal extends Task {
  goalColor: string
  goalName: string;
}
