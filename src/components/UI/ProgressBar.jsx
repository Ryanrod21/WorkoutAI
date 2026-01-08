export default function ProgressBar({ progressPercent, show }) {
  if (!show) return null;

  return (
    <div className="progress-wrapper">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="progress-text">{progressPercent}%</span>
    </div>
  );
}
