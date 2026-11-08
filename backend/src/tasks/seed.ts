import type { NewTask, TaskRepository } from './types.js';

export const DEMO_TASKS: NewTask[] = [
  { title: 'Fix login redirect loop', priority: 'high' },
  { title: 'Rotate staging database credentials', priority: 'high' },
  { title: 'Write release notes for v2.4', priority: 'medium' },
  { title: 'Review onboarding copy', priority: 'medium' },
  { title: 'Clean up unused feature flags', priority: 'low' },
];

export async function seed(repo: TaskRepository, tasks = DEMO_TASKS) {
  for (const task of tasks) await repo.create(task);
}
