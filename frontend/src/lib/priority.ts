import type { Priority } from '../types';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#6b7280',
  medium: '#d97706',
  high: '#7c3aed',
};
