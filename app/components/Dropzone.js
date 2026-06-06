'use client';

export default function Dropzone({
  file, isDragging, isBusy, mode, fileInputRef, fileInputKey, acceptValue,
  onFileSelect, onClear, onDragEnter, onDragLeave, onDrop, onOpenFileDialog, formatBytes
}) {
  return (
    <>
      <input
        accept={acceptValue}
        className="file-input-hidden"
        disabled={isBusy}
        key={fileInputKey}
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        ref={fileInputRef}
        type="file"
      />
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onClick={onOpenFileDialog}
        onDragEnter={(e) => { e.preventDefault(); onDragEnter(); }}
        onDragLeave={(e) => { e.preventDefault(); onDragLeave(); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onDrop(e); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenFileDialog(); } }}
        role="button"
        tabIndex={0}
      >
        <span className="dropzone-icon">↑</span>
        <div className="dropzone-content">
          <p className="dropzone-title">{file ? file.name : mode.fileLabel}</p>
          <p className="dropzone-subtitle">
            {file ? `${formatBytes(file.size)} selected` : `Drop or browse ${mode.allowedExtensions.join(', ')}`}
          </p>
        </div>
        {file && (
          <button
            className="dropzone-clear"
            disabled={isBusy}
            onClick={(e) => onClear(e)}
            type="button"
          >
            Remove
          </button>
        )}
      </div>
    </>
  );
}
