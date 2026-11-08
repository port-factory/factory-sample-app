import { describe, expect, it } from 'vitest';
import { sortTasks, summarize } from '../../src/tasks/service.js';
import type { Task } from '../../src/tasks/types.js';

const task = (overrides: Partial<Task>): Task => ({
  id: 1,
  title: 't',
  priority: 'medium',
  done: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('sortTasks', () => {
  it('puts open tasks before done ones, then sorts by priority and age', () => {
    const tasks = [
      task({ id: 1, priority: 'high', done: true }),
      task({ id: 2, priority: 'low' }),
      task({ id: 3, priority: 'high', createdAt: '2026-01-02T00:00:00.000Z' }),
      task({ id: 4, priority: 'high' }),
    ];
    expect(sortTasks(tasks).map((t) => t.id)).toEqual([4, 3, 2, 1]);
  });

  it('does not mutate its input', () => {
    const tasks = [task({ id: 2, priority: 'low' }), task({ id: 1, priority: 'high' })];
    sortTasks(tasks);
    expect(tasks.map((t) => t.id)).toEqual([2, 1]);
  });
});

describe('summarize', () => {
  it('counts open and done tasks', () => {
    expect(summarize([task({ done: true }), task({}), task({})])).toEqual({
      total: 3,
      done: 1,
      open: 2,
    });
  });
});
