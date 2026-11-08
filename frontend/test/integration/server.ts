import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { Task } from '../../src/types';

/** A small stateful fake of the backend API, reset between tests. */
export function createFakeBackend() {
  let tasks: Task[] = [];
  let nextId = 1;

  const listResponse = () => {
    const done = tasks.filter((t) => t.done).length;
    return { tasks, summary: { total: tasks.length, done, open: tasks.length - done } };
  };

  const server = setupServer(
    http.get('*/api/tasks', () => HttpResponse.json(listResponse())),
    http.post('*/api/tasks', async ({ request }) => {
      const body = (await request.json()) as Pick<Task, 'title' | 'priority'>;
      const task: Task = {
        id: nextId++,
        ...body,
        done: false,
        createdAt: new Date().toISOString(),
      };
      tasks.push(task);
      return HttpResponse.json(task, { status: 201 });
    }),
    http.patch('*/api/tasks/:id', async ({ params, request }) => {
      const { done } = (await request.json()) as { done: boolean };
      const task = tasks.find((t) => t.id === Number(params.id));
      if (!task) return HttpResponse.json({ errors: ['task not found'] }, { status: 404 });
      task.done = done;
      return HttpResponse.json(task);
    }),
    http.delete('*/api/tasks/:id', ({ params }) => {
      tasks = tasks.filter((t) => t.id !== Number(params.id));
      return new HttpResponse(null, { status: 204 });
    }),
  );

  return {
    server,
    reset() {
      tasks = [];
      nextId = 1;
    },
  };
}
