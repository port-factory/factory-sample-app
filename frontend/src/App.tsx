import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { filterTasks, type Filter } from './lib/filterTasks';
import { sortTasks, type Sort } from './lib/sortTasks';
import type { Priority, Task, TaskListResponse } from './types';

export function App() {
  const [data, setData] = useState<TaskListResponse>();
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('default');

  const run = useCallback(async (action: () => Promise<unknown>) => {
    try {
      await action();
      setData(await api.listTasks());
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void run(async () => {});
  }, [run]);

  const create = (title: string, priority: Priority) => run(() => api.createTask(title, priority));
  const toggle = (task: Task) => run(() => api.setDone(task.id, !task.done));
  const remove = (task: Task) => run(() => api.deleteTask(task.id));

  return (
    <main>
      <h1>Tasks</h1>
      {error && <p role="alert">{error}</p>}
      <TaskForm onSubmit={create} />
      {!data ? (
        <p>Loading…</p>
      ) : (
        <>
          <p aria-label="summary">
            {data.summary.open} open / {data.summary.done} done
          </p>
          <div className="controls">
            <div role="group" aria-label="filter">
              {(['all', 'open', 'done'] as const).map((f) => (
                <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div role="group" aria-label="sort">
              {(['default', 'priority'] as const).map((s) => (
                <button key={s} aria-pressed={sort === s} onClick={() => setSort(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <TaskList
            tasks={sortTasks(filterTasks(data.tasks, filter), sort)}
            onToggle={toggle}
            onDelete={remove}
          />
        </>
      )}
    </main>
  );
}
