import {Component, inject} from '@angular/core';
import {GoalService} from '../../services/goal.service';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-goals',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
  standalone: true
})
export class Goals {
  public goals$ = inject(GoalService).goals$
}
