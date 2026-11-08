import type { NewTask, Task, TaskRepository } from './types.js';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks = new Map<number, Task>();
  private nextId = 1;

  async list() {
    return [...this.tasks.values()];
  }

  async get(id: number) {
    return this.tasks.get(id);
  }

  async create(input: NewTask) {
    const task: Task = {
      id: this.nextId++,
      ...input,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async setDone(id: number, done: boolean) {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, done };
    this.tasks.set(id, updated);
    return updated;
  }

  async remove(id: number) {
    return this.tasks.delete(id);
  }
}
