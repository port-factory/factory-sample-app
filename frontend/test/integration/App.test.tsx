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

  it('updates the progress bar after toggling a task', async () => {
    render(<App />);
    await screen.findByText('No tasks');
    expect(screen.getByText('0 of 0 done')).toBeInTheDocument();

    await addTask('Write integration tests');
    await addTask('Set up CI');
    expect(screen.getByText('0 of 2 done')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Set up CI' }));
    expect(await screen.findByText('1 of 2 done')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '2');
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
