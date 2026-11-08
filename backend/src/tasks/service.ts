import type { Priority, Task } from './types.js';

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Open tasks first, then by priority, then oldest first. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) ||
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
      a.createdAt.localeCompare(b.createdAt) ||
      a.id - b.id,
  );
}

export function summarize(tasks: Task[]): { total: number; done: number; open: number } {
  const done = tasks.filter((t) => t.done).length;
  return { total: tasks.length, done, open: tasks.length - done };
}
