import type { NewTask, Priority } from './types.js';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'];
export const MAX_TITLE_LENGTH = 200;

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

export function validateNewTask(body: unknown): ValidationResult<NewTask> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, errors: ['body must be an object'] };
  }
  const { title, priority = 'medium' } = body as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required');
  } else if (title.trim().length > MAX_TITLE_LENGTH) {
    errors.push(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  if (!PRIORITIES.includes(priority as Priority)) {
    errors.push(`priority must be one of ${PRIORITIES.join(', ')}`);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { title: (title as string).trim(), priority: priority as Priority } };
}

export function parseId(raw: string): number | undefined {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}
