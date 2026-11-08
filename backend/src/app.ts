import express, { type NextFunction, type Request, type Response } from 'express';
import { sortTasks, summarize } from './tasks/service.js';
import type { TaskRepository } from './tasks/types.js';
import { parseId, validateNewTask } from './tasks/validation.js';

export function createApp(repo: TaskRepository) {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/tasks', async (_req, res) => {
    const tasks = sortTasks(await repo.list());
    res.json({ tasks, summary: summarize(tasks) });
  });

  app.post('/api/tasks', async (req, res) => {
    const result = validateNewTask(req.body);
    if (!result.ok) {
      res.status(400).json({ errors: result.errors });
      return;
    }
    res.status(201).json(await repo.create(result.value));
  });

  app.patch('/api/tasks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === undefined || typeof req.body?.done !== 'boolean') {
      res.status(400).json({ errors: ['a valid id and boolean "done" are required'] });
      return;
    }
    const task = await repo.setDone(id, req.body.done);
    if (!task) {
      res.status(404).json({ errors: ['task not found'] });
      return;
    }
    res.json(task);
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === undefined || !(await repo.remove(id))) {
      res.status(404).json({ errors: ['task not found'] });
      return;
    }
    res.status(204).end();
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ errors: ['internal error'] });
  });

  return app;
}
