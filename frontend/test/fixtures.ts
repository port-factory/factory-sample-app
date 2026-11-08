import type { Task } from '../src/types';

export const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Task',
  priority: 'medium',
  done: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});
