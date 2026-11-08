import type pg from 'pg';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { createPool, migrate } from '../../src/db.js';
import { PgTaskRepository } from '../../src/tasks/pgRepository.js';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/tasks_test';

describe('tasks API against Postgres', () => {
  let pool: pg.Pool;
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    pool = createPool(DATABASE_URL);
    await migrate(pool);
    app = createApp(new PgTaskRepository(pool));
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE tasks RESTART IDENTITY');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('reports healthy', async () => {
    await request(app).get('/api/health').expect(200, { status: 'ok' });
  });

  it('creates a task and persists it', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Wire up CI', priority: 'high' })
      .expect(201);

    expect(res.body).toMatchObject({ id: 1, title: 'Wire up CI', priority: 'high', done: false });

    const { rows } = await pool.query('SELECT title FROM tasks');
    expect(rows).toEqual([{ title: 'Wire up CI' }]);
  });

  it('lists tasks sorted with a summary', async () => {
    await request(app).post('/api/tasks').send({ title: 'low one', priority: 'low' });
    await request(app).post('/api/tasks').send({ title: 'high one', priority: 'high' });
    await request(app).patch('/api/tasks/2').send({ done: true });

    const res = await request(app).get('/api/tasks').expect(200);
    expect(res.body.tasks.map((t: { title: string }) => t.title)).toEqual(['low one', 'high one']);
    expect(res.body.summary).toEqual({ total: 2, done: 1, open: 1 });
  });

  it('toggles done and returns 404 for unknown ids', async () => {
    await request(app).post('/api/tasks').send({ title: 'toggle me' });
    const res = await request(app).patch('/api/tasks/1').send({ done: true }).expect(200);
    expect(res.body.done).toBe(true);

    await request(app).patch('/api/tasks/999').send({ done: true }).expect(404);
  });

  it('deletes a task', async () => {
    await request(app).post('/api/tasks').send({ title: 'delete me' });
    await request(app).delete('/api/tasks/1').expect(204);
    await request(app).delete('/api/tasks/1').expect(404);

    const { rowCount } = await pool.query('SELECT 1 FROM tasks');
    expect(rowCount).toBe(0);
  });

  it('enforces the priority constraint at the database level', async () => {
    await expect(
      pool.query("INSERT INTO tasks (title, priority) VALUES ('x', 'urgent')"),
    ).rejects.toThrow(/check constraint/);
  });
});
