import {Routes} from '@angular/router';
import {Dashboard} from './componets/dashboard/dashboard';
import {CreateGoal} from './componets/create-goal/create-goal';
import {EditTask} from './componets/edit-task/edit-task';

export const routes: Routes = [
  {path: '', component: Dashboard},
  {path: 'create', component: CreateGoal},
  {path: 'edit-task/:goalId/:taskId', component: EditTask},
  {path: '**', redirectTo: ''}
];
