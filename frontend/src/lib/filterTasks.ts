import type { Task } from '../types';

export type Filter = 'all' | 'open' | 'done';

export function filterTasks(tasks: Task[], filter: Filter, query = ''): Task[] {
  const needle = query.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (filter === 'all' || (filter === 'done') === t.done) &&
      (needle === '' || t.title.toLowerCase().includes(needle)),
  );
}
