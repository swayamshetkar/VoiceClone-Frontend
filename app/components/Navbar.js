'use client';

export default function Navbar({ backendStatus }) {
  const isOnline = backendStatus === 'Backend Online';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="#top" aria-label="VoiceFront home">VoiceFront</a>
        <div className="navbar-links">
          <a className="navbar-link" href="https://huggingface.co/spaces/swayamshetkar/Vdub-orchestrator" target="_blank" rel="noopener noreferrer">Backend Repo</a>
          <a className="navbar-link" href="https://github.com/swayamshetkar/VoiceClone-Frontend" target="_blank" rel="noopener noreferrer">Frontend Repo</a>
        </div>
        <div className={`navbar-health ${isOnline ? 'online' : 'offline'}`}>
          <span className="health-dot" />
          {backendStatus}
        </div>
      </div>
    </nav>
  );
}
