import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {TaskCard} from './componets/task-card/task-card';
import {CreateGoal} from './componets/create-goal/create-goal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, TaskCard, CreateGoal, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {


}
