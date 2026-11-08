import { describe, expect, it } from 'vitest';
import { InMemoryTaskRepository } from '../../src/tasks/memoryRepository.js';
import { DEMO_TASKS, seed } from '../../src/tasks/seed.js';

describe('seed', () => {
  it('creates every demo task', async () => {
    const repo = new InMemoryTaskRepository();
    await seed(repo);
    expect((await repo.list()).map((t) => t.title)).toEqual(DEMO_TASKS.map((t) => t.title));
  });
});
