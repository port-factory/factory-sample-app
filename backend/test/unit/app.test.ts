import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { InMemoryTaskRepository } from '../../src/tasks/memoryRepository.js';

// Route-level unit tests: HTTP layer with an in-memory repository, no database.
describe('task routes (in-memory)', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp(new InMemoryTaskRepository());
  });

  it('returns 400 with validation errors', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'nope' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(2);
  });

  it('returns 400 for a PATCH without a boolean done', async () => {
    const res = await request(app).patch('/api/tasks/1').send({ done: 'yes' });
    expect(res.status).toBe(400);
  });

  it('returns 404 when deleting an unknown task', async () => {
    const res = await request(app).delete('/api/tasks/99');
    expect(res.status).toBe(404);
  });
});
