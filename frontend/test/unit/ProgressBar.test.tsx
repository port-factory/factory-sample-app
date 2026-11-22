import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../../src/components/ProgressBar';

function fillWidth() {
  const bar = screen.getByRole('progressbar');
  return (bar.firstElementChild as HTMLElement).style.width;
}

describe('ProgressBar', () => {
  it('shows 0 of 0 with an empty bar and no divide-by-zero', () => {
    render(<ProgressBar done={0} total={0} />);
    expect(screen.getByText('0 of 0 done (0%)')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '0');
    expect(fillWidth()).toBe('0%');
  });

  it('fills the done share of the bar for partial progress', () => {
    render(<ProgressBar done={3} total={5} />);
    expect(screen.getByText('3 of 5 done (60%)')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(fillWidth()).toBe('60%');
  });

  it('is full when all tasks are done', () => {
    render(<ProgressBar done={4} total={4} />);
    expect(screen.getByText('4 of 4 done (100%)')).toBeInTheDocument();
    expect(fillWidth()).toBe('100%');
  });
});
