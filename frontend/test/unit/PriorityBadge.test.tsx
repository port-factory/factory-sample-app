import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../../src/components/PriorityBadge';

describe('PriorityBadge', () => {
  it.each([
    ['low', 'Low'],
    ['medium', 'Medium'],
    ['high', 'High'],
  ] as const)('labels %s as %s', (priority, label) => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
