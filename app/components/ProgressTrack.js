'use client';

export default function ProgressTrack({ state, runStates }) {
  return (
    <div className="progress-track" aria-label="Processing states">
      {runStates.map((item) => (
        <span
          key={item}
          className={`progress-step ${
            item === state || (state === 'Failed' && item === 'Processing') ? 'active' : ''
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
