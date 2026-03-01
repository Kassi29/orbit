export interface Task {
  id: string;
  isCompleted: boolean;
  endDay: string;
  goalId: string;
  name: string;
  frequency: number[];
  startDay: string;
}
