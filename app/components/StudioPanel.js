'use client';

import ModeTabs from './ModeTabs';
import Dropzone from './Dropzone';
import ProgressTrack from './ProgressTrack';

export default function StudioPanel({
  mode, modes, modeId, form, state, statusText, error, isBusy, isDragging,
  submitLabel, fileInputKey, fileInputRef, acceptValue,
  onSubmit, onSwitchMode, onFileSelect, onClear, onDragEnter, onDragLeave,
  onDrop, onUpdateForm, onOpenFileDialog, LANGUAGES, MAX_TEXT_LENGTH, RUN_STATES, formatBytes
}) {
  return (
    <section className="studio-section" id="studio" data-reveal>
      <form className="studio-panel" onSubmit={onSubmit}>
        <div className="studio-header">
          <div className="studio-header-text">
            <p className="studio-eyebrow">Create</p>
            <h2 className="studio-title">{mode.label}</h2>
          </div>
          <span className={`studio-state-pill ${state.toLowerCase()}`}>{state}</span>
        </div>

        <ModeTabs modes={modes} modeId={modeId} isBusy={isBusy} onSwitch={onSwitchMode} />

        <Dropzone
          file={form.file}
          isDragging={isDragging}
          isBusy={isBusy}
          mode={mode}
          fileInputRef={fileInputRef}
          fileInputKey={fileInputKey}
          acceptValue={acceptValue}
          onFileSelect={onFileSelect}
          onClear={onClear}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onOpenFileDialog={onOpenFileDialog}
          formatBytes={formatBytes}
        />

        {mode.id !== 'clone' && (
          <div className="form-group">
            <label className="form-label">{mode.languageLabel}</label>
            <select
              className="form-select"
              disabled={isBusy}
              onChange={(e) => onUpdateForm('targetLanguage', e.target.value)}
              required
              value={form.targetLanguage}
            >
              <option value="" disabled>Select language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        )}

        {mode.id === 'clone' && (
          <div className="form-group">
            <label className="form-label">Text</label>
            <textarea
              className="form-textarea"
              disabled={isBusy}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(e) => onUpdateForm('text', e.target.value)}
              placeholder="Enter text to synthesize"
              required
              rows={5}
              value={form.text}
            />
          </div>
        )}

        {mode.id === 'video' && (
          <>
            <p className="form-warning">⚠ Video Dubbing is in testing phase. Results may vary.</p>
            <p className="form-warning" style={{ borderColor: 'rgba(184,155,106,0.2)', background: 'rgba(184,155,106,0.08)', color: '#C8AD7E' }}>Final video generation usually takes around 5 minutes.</p>
          </>
        )}

        {mode.id === 'audio' && (
          <p className="form-warning">⚠ Audio Dubbing is in testing phase. Results may vary.</p>
        )}

        <ProgressTrack state={state} runStates={RUN_STATES} />

        <div className="status-bar">
          <div className="status-info">
            <div className="status-label">Status</div>
            <div className="status-value">{statusText}</div>
          </div>
          <button className="submit-btn" disabled={isBusy} type="submit">
            {submitLabel}
          </button>
        </div>

        {error && <p className="error-banner">{error}</p>}
      </form>
    </section>
  );
}
