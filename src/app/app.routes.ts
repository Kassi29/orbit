import {Routes} from '@angular/router';
import {Dashboard} from './componets/dashboard/dashboard';
import {CreateGoal} from './componets/create-goal/create-goal';
import {EditTask} from './componets/edit-task/edit-task';
import {Goals} from './componets/goals/goals';
import {GoalDetail} from './componets/goal-detail/goal-detail';
import {CreateTask} from './componets/create-task/create-task';
import {EditGoal} from './componets/edit-goal/edit-goal';

export const routes: Routes = [
  {path: '', component: Dashboard},
  {path: 'create', component: CreateGoal},
  {path: 'edit-task/:goalId/:taskId', component: EditTask},
  { path: 'edit-goal/:goalId', component: EditGoal },
  {path: 'goal-detail/:goalId', component: GoalDetail},
  {path: 'all-goals', component: Goals},
  {path: 'create-goal-detail', component: CreateGoal},
  {path: 'create-task/:goalId', component: CreateTask},
  {path: '**', redirectTo: ''}
];
