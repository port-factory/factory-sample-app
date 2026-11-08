import type { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) return <p className="empty">No tasks</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} data-priority={task.priority} className={task.done ? 'done' : undefined}>
          <label>
            <input type="checkbox" checked={task.done} onChange={() => onToggle(task)} />
            <span className="title">{task.title}</span>
          </label>
          <PriorityBadge priority={task.priority} />
          <button
            className="delete"
            aria-label={`Delete ${task.title}`}
            onClick={() => onDelete(task)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
