import { useState, type FormEvent } from 'react';
import type { Priority } from '../types';

interface Props {
  onSubmit: (title: string, priority: Priority) => Promise<void> | void;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit(title.trim(), priority);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} aria-label="new task">
      <input
        aria-label="Title"
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        aria-label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}
