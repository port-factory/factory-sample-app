import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {
  it('disables submit until a title is entered', async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Add' });
    expect(button).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Title'), '   ');
    expect(button).toBeDisabled();
  });

  it('submits trimmed title and chosen priority, then clears', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Title'), '  Deploy  ');
    await userEvent.selectOptions(screen.getByLabelText('Priority'), 'high');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSubmit).toHaveBeenCalledWith('Deploy', 'high');
    expect(screen.getByLabelText('Title')).toHaveValue('');
  });
});
