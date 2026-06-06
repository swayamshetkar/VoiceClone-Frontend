'use client';

export default function Hero({ onScrollToStudio, onScrollToDocs }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content" data-reveal>
        <p className="hero-eyebrow" data-reveal data-reveal-delay="1">AI-Powered Voice Studio</p>
        <h1 className="hero-title" data-reveal data-reveal-delay="2">
          Dub video.<br />Translate audio.<br />Clone voice.
        </h1>
        <p className="hero-description" data-reveal data-reveal-delay="3">
          A focused upload studio for localization, clean downloads, and a smoother 
          experience while the backend does the heavy lifting.
        </p>
        <div className="hero-cta-group" data-reveal data-reveal-delay="4">
          <a className="hero-cta-primary" href="#studio" onClick={(e) => { e.preventDefault(); onScrollToStudio(); }}>Start a job</a>
          <button className="hero-cta-secondary" type="button" onClick={onScrollToDocs}>View documentation</button>
        </div>
        <div className="hero-specs" data-reveal data-reveal-delay="5">
          <span className="hero-spec-badge">100 MB video</span>
          <span className="hero-spec-badge">50 MB audio</span>
          <span className="hero-spec-badge">Direct backend calls</span>
        </div>
      </div>
    </section>
  );
}
