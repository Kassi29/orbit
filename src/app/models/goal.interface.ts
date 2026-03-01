import {Task} from './task.interface';

export interface Goal {
  id: string;
  color: string;
  endDay: string;
  name: string;
  startDay: string;
  tasks: Task[];
}
