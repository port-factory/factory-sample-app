import type { Priority, Task } from '../types';

export type Sort = 'default' | 'priority';

const RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Returns a new array; with 'priority' sorts high, medium, low (stable). */
export function sortTasks(tasks: Task[], sort: Sort): Task[] {
  if (sort === 'default') return [...tasks];
  return [...tasks].sort((a, b) => RANK[a.priority] - RANK[b.priority]);
}
