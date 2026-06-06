'use client';

export default function ModeTabs({ modes, modeId, isBusy, onSwitch }) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Application modes">
      {modes.map((item) => (
        <button
          key={item.id}
          className={`mode-tab ${item.id === modeId ? 'active' : ''}`}
          aria-selected={item.id === modeId}
          disabled={isBusy}
          onClick={() => onSwitch(item.id)}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
