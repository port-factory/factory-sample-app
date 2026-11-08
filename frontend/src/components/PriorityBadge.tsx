import { PRIORITY_COLORS, PRIORITY_LABELS } from '../lib/priority';
import type { Priority } from '../types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className="badge" style={{ backgroundColor: PRIORITY_COLORS[priority] }}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
