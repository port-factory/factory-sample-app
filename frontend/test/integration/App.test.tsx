import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { App } from '../../src/App';
import { createFakeBackend } from './server';

// Full App + real fetch client, with the network stubbed by MSW.
const backend = createFakeBackend();

beforeAll(() => {
  // jsdom has no origin for relative URLs; give fetch one.
  const realFetch = globalThis.fetch;
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) =>
    realFetch(typeof input === 'string' ? new URL(input, 'http://localhost') : input, init),
  );
  backend.server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  backend.server.resetHandlers();
  backend.reset();
});
afterAll(() => {
  backend.server.close();
  vi.unstubAllGlobals();
});

async function addTask(title: string) {
  await userEvent.type(screen.getByLabelText('Title'), title);
  await userEvent.click(screen.getByRole('button', { name: 'Add' }));
  await screen.findByText(title);
}

describe('App', () => {
  it('loads and shows an empty list', async () => {
    render(<App />);
    expect(await screen.findByText('No tasks')).toBeInTheDocument();
    expect(screen.getByLabelText('summary')).toHaveTextContent('0 open / 0 done');
  });

  it('creates, completes, filters and deletes tasks', async () => {
    render(<App />);
    await screen.findByText('No tasks');

    await addTask('Write integration tests');
    await addTask('Set up CI');
    expect(screen.getByLabelText('summary')).toHaveTextContent('2 open / 0 done');

    await userEvent.click(screen.getByRole('checkbox', { name: 'Set up CI' }));
    expect(await screen.findByText('1 open / 1 done')).toBeInTheDocument();

    const filters = within(screen.getByRole('group', { name: 'filter' }));
    await userEvent.click(filters.getByRole('button', { name: 'done' }));
    expect(screen.queryByText('Write integration tests')).not.toBeInTheDocument();
    expect(screen.getByText('Set up CI')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete Set up CI' }));
    expect(await screen.findByText('No tasks')).toBeInTheDocument();
  });

  it('sorts by priority, combines with the filter and keeps the sort', async () => {
    render(<App />);
    await screen.findByText('No tasks');

    const addWithPriority = async (title: string, priority: string) => {
      await userEvent.selectOptions(screen.getByLabelText('Priority'), priority);
      await addTask(title);
    };
    await addWithPriority('Low one', 'low');
    await addWithPriority('High one', 'high');
    await addWithPriority('Medium one', 'medium');
    await addWithPriority('High two', 'high');

    const titles = () =>
      within(screen.getByRole('list'))
        .getAllByRole('listitem')
        .map((li) => li.querySelector('.title')?.textContent);
    const sortGroup = within(screen.getByRole('group', { name: 'sort' }));
    expect(sortGroup.getByRole('button', { name: 'default' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const defaultOrder = ['Low one', 'High one', 'Medium one', 'High two'];
    expect(titles()).toEqual(defaultOrder);

    await userEvent.click(sortGroup.getByRole('button', { name: 'priority' }));
    expect(sortGroup.getByRole('button', { name: 'priority' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const byPriority = ['High one', 'High two', 'Medium one', 'Low one'];
    expect(titles()).toEqual(byPriority);

    // sort persists after add and toggle, and combines with the filter
    await addWithPriority('Medium two', 'medium');
    expect(titles()).toEqual(['High one', 'High two', 'Medium one', 'Medium two', 'Low one']);
    await userEvent.click(screen.getByRole('checkbox', { name: 'High one' }));
    await screen.findByText('4 open / 1 done');
    const filters = within(screen.getByRole('group', { name: 'filter' }));
    await userEvent.click(filters.getByRole('button', { name: 'open' }));
    expect(titles()).toEqual(['High two', 'Medium one', 'Medium two', 'Low one']);

    await userEvent.click(sortGroup.getByRole('button', { name: 'default' }));
    expect(titles()).toEqual(['Low one', 'Medium one', 'High two', 'Medium two']);
  });

  it('surfaces API errors', async () => {
    backend.server.use(
      http.post('*/api/tasks', () =>
        HttpResponse.json({ errors: ['title is required'] }, { status: 400 }),
      ),
    );
    render(<App />);
    await screen.findByText('No tasks');

    await userEvent.type(screen.getByLabelText('Title'), 'boom');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('title is required');
  });
});
