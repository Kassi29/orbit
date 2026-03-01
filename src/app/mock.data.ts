import {Goal} from './models/goal.interface';
export const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    name: 'Master Angular 19',
    color: '#BAE6FD',
    startDay: '2026-01-01',
    endDay: '2026-12-31',
    tasks: [
      {
        id: 't1',
        isCompleted: false,
        goalId: '1',
        name: 'Practice RxJS Pipes',
        frequency: [0, 1, 2, 3, 4, 5, 6],
        startDay: '2026-01-01',
        endDay: '2026-12-31'
      }
    ]
  },
  {
    id: '2',
    name: 'Healthy Habits',
    color: '#BBF7D0',
    startDay: '2026-01-01',
    endDay: '2026-12-31',
    tasks: [
      {
        id: 't2',
        isCompleted: false,
        goalId: '2',
        name: 'Morning Meditation',
        frequency: [1, 2, 3, 4, 5],
        startDay: '2026-01-01',
        endDay: '2026-12-31'
      },
      {
        id: 't3',
        isCompleted: false,
        goalId: '2',
        name: 'Drink 2L Water',
        frequency: [0, 1, 2, 3, 4, 5, 6],
        startDay: '2026-01-01',
        endDay: '2026-12-31'
      }
    ]
  },
  {
    id: '3',
    name: 'Deep Reading',
    color: '#E9D5FF',
    startDay: '2026-01-01',
    endDay: '2026-12-31',
    tasks: [
      {
        id: 't4',
        isCompleted: false,
        goalId: '3',
        name: 'Read 15 Pages',
        frequency: [0, 6], // Solo fines de semana
        startDay: '2026-01-01',
        endDay: '2026-12-31'
      }
    ]
  }
];
