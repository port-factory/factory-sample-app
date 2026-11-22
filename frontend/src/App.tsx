import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { filterTasks, type Filter } from './lib/filterTasks';
import type { Priority, Task, TaskListResponse } from './types';

export function App() {
  const [data, setData] = useState<TaskListResponse>();
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState<Filter>('all');

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

  const visibleTasks = data ? filterTasks(data.tasks, filter) : [];

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
          <div role="group" aria-label="filter">
            {(['all', 'open', 'done'] as const).map((f) => (
              <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <TaskList
            tasks={visibleTasks}
            onToggle={toggle}
            onDelete={remove}
            emptyMessage={
              data.tasks.length > 0 ? `No tasks match the "${filter}" filter` : undefined
            }
          />
        </>
      )}
    </main>
  );
}
