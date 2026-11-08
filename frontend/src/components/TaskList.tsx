import type { Task } from '../types';

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) return <p>No tasks</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} data-priority={task.priority}>
          <label>
            <input type="checkbox" checked={task.done} onChange={() => onToggle(task)} />
            <span style={{ textDecoration: task.done ? 'line-through' : undefined }}>
              {task.title}
            </span>
          </label>
          <button aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
