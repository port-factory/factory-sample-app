import { sortTasks } from '../../src/lib/sortTasks';
import { filterTasks } from '../../src/lib/filterTasks';
import { makeTask } from '../fixtures';

const tasks = [
  makeTask({ id: 1, priority: 'low' }),
  makeTask({ id: 2, priority: 'high', done: true }),
  makeTask({ id: 3, priority: 'medium' }),
  makeTask({ id: 4, priority: 'high' }),
  makeTask({ id: 5, priority: 'low' }),
  makeTask({ id: 6, priority: 'medium' }),
];

describe('sortTasks', () => {
  it('keeps the original order for default', () => {
    expect(sortTasks(tasks, 'default').map((t) => t.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('orders high, medium, low and keeps equal priorities stable', () => {
    expect(sortTasks(tasks, 'priority').map((t) => t.id)).toEqual([2, 4, 3, 6, 1, 5]);
  });

  it('does not mutate the input', () => {
    const copy = [...tasks];
    sortTasks(tasks, 'priority');
    expect(tasks).toEqual(copy);
  });

  it('combines with filtering', () => {
    expect(sortTasks(filterTasks(tasks, 'open'), 'priority').map((t) => t.id)).toEqual([
      4, 3, 6, 1, 5,
    ]);
  });
});
