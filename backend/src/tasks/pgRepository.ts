import type pg from 'pg';
import type { NewTask, Task, TaskRepository } from './types.js';

interface TaskRow {
  id: number;
  title: string;
  priority: Task['priority'];
  done: boolean;
  created_at: Date;
}

const toTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  priority: row.priority,
  done: row.done,
  createdAt: row.created_at.toISOString(),
});

export class PgTaskRepository implements TaskRepository {
  constructor(private readonly pool: pg.Pool) {}

  async list() {
    const { rows } = await this.pool.query<TaskRow>('SELECT * FROM tasks');
    return rows.map(toTask);
  }

  async get(id: number) {
    const { rows } = await this.pool.query<TaskRow>('SELECT * FROM tasks WHERE id = $1', [id]);
    return rows[0] && toTask(rows[0]);
  }

  async create({ title, priority }: NewTask) {
    const { rows } = await this.pool.query<TaskRow>(
      'INSERT INTO tasks (title, priority) VALUES ($1, $2) RETURNING *',
      [title, priority],
    );
    return toTask(rows[0]);
  }

  async setDone(id: number, done: boolean) {
    const { rows } = await this.pool.query<TaskRow>(
      'UPDATE tasks SET done = $2 WHERE id = $1 RETURNING *',
      [id, done],
    );
    return rows[0] && toTask(rows[0]);
  }

  async remove(id: number) {
    const { rowCount } = await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return rowCount === 1;
  }
}
