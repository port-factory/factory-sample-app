interface Props {
  done: number;
  total: number;
}

export function ProgressBar({ done, total }: Props) {
  const percent = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-label="progress"
        aria-valuemin={0}
        aria-valuenow={done}
        aria-valuemax={total}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-label">
        {done} of {total} done
      </span>
    </div>
  );
}
