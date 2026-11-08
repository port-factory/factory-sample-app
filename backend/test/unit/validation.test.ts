import { describe, expect, it } from 'vitest';
import { MAX_TITLE_LENGTH, parseId, validateNewTask } from '../../src/tasks/validation.js';

describe('validateNewTask', () => {
  it('accepts a valid task and trims the title', () => {
    expect(validateNewTask({ title: '  Ship it  ', priority: 'high' })).toEqual({
      ok: true,
      value: { title: 'Ship it', priority: 'high' },
    });
  });

  it('defaults priority to medium', () => {
    const result = validateNewTask({ title: 'Write docs' });
    expect(result.ok && result.value.priority).toBe('medium');
  });

  it.each([null, 'string', 42])('rejects non-object body %p', (body) => {
    expect(validateNewTask(body)).toEqual({ ok: false, errors: ['body must be an object'] });
  });

  it('rejects a blank title', () => {
    expect(validateNewTask({ title: '   ' })).toEqual({ ok: false, errors: ['title is required'] });
  });

  it('rejects a title that is too long', () => {
    const result = validateNewTask({ title: 'x'.repeat(MAX_TITLE_LENGTH + 1) });
    expect(result.ok).toBe(false);
  });

  it('reports every error at once', () => {
    const result = validateNewTask({ title: '', priority: 'urgent' });
    expect(!result.ok && result.errors).toHaveLength(2);
  });
});

describe('parseId', () => {
  it.each([
    ['1', 1],
    ['42', 42],
    ['0', undefined],
    ['-3', undefined],
    ['1.5', undefined],
    ['abc', undefined],
  ])('parseId(%s) -> %s', (raw, expected) => {
    expect(parseId(raw)).toBe(expected);
  });
});
