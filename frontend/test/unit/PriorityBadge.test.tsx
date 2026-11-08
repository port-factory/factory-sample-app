import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../../src/components/PriorityBadge';
import { PRIORITY_COLORS } from '../../src/lib/priority';

describe('PriorityBadge', () => {
  it.each([
    ['low', 'Low'],
    ['medium', 'Medium'],
    ['high', 'High'],
  ] as const)('labels %s as %s', (priority, label) => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('uses a distinct color for every priority', () => {
    const colors = Object.values(PRIORITY_COLORS);
    expect(new Set(colors).size).toBe(colors.length);
  });
});
