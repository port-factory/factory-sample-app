import type { Priority, Task, TaskListResponse } from './types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly errors: string[],
  ) {
    super(errors.join(', ') || `request failed with ${status}`);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.errors ?? []);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  listTasks: () => request<TaskListResponse>('/api/tasks'),
  createTask: (title: string, priority: Priority) =>
    request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify({ title, priority }) }),
  setDone: (id: number, done: boolean) =>
    request<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ done }) }),
  deleteTask: (id: number) => request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
};
