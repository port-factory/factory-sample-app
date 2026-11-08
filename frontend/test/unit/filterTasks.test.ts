import { filterTasks } from '../../src/lib/filterTasks';
import { makeTask } from '../fixtures';

const tasks = [
  makeTask({ id: 1, title: 'Write tests', done: false }),
  makeTask({ id: 2, title: 'Ship release', done: true }),
  makeTask({ id: 3, title: 'Write docs', done: true }),
];

describe('filterTasks', () => {
  it.each([
    ['all', [1, 2, 3]],
    ['open', [1]],
    ['done', [2, 3]],
  ] as const)('filter=%s', (filter, ids) => {
    expect(filterTasks(tasks, filter).map((t) => t.id)).toEqual(ids);
  });

  it('matches the query case-insensitively', () => {
    expect(filterTasks(tasks, 'all', '  WRITE ').map((t) => t.id)).toEqual([1, 3]);
  });

  it('combines filter and query', () => {
    expect(filterTasks(tasks, 'done', 'write').map((t) => t.id)).toEqual([3]);
  });
});
