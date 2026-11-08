import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../src/components/TaskList';
import { makeTask } from '../fixtures';

describe('TaskList', () => {
  it('shows an empty state', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  it('renders tasks and forwards toggle/delete', async () => {
    const task = makeTask({ title: 'Review PR', done: true });
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    render(<TaskList tasks={[task]} onToggle={onToggle} onDelete={onDelete} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Review PR' });
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(task);

    await userEvent.click(screen.getByRole('button', { name: 'Delete Review PR' }));
    expect(onDelete).toHaveBeenCalledWith(task);
  });
});
