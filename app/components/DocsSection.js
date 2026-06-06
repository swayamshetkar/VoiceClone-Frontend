'use client';

export default function DocsSection() {
  return (
    <section className="docs-section" id="documentation">
      <div className="docs-inner">
        <header className="docs-header" data-reveal>
          <div className="docs-badge">Documentation</div>
          <h2 className="docs-title">AI Video Dubbing Platform</h2>
          <p className="docs-subtitle">Complete System Architecture & Technical Specifications</p>
        </header>

        <div className="docs-grid">
          {/* Overview */}
          <article className="docs-card" data-reveal>
            <h3 className="docs-card-title">Overview</h3>
            <p>This project is a modular AI-powered video dubbing platform capable of:</p>
            <ul className="docs-list">
              <li>Speech-to-text transcription</li>
              <li>Language translation</li>
              <li>Voice cloning</li>
              <li>Audio synchronization</li>
              <li>Lip synchronization</li>
              <li>End-to-end dubbed video generation</li>
            </ul>
            <p className="docs-note">The system is designed as a collection of independent services orchestrated by a central backend.</p>
          </article>

          {/* High Level Architecture */}
          <article className="docs-card docs-card-wide" data-reveal>
            <h3 className="docs-card-title">High Level Architecture</h3>
            <pre className="docs-code"><code>{`Frontend
    │
    ▼
Main Orchestrator Backend
    │
    ├──────────────► API1 (/process)
    │                     │
    │                     ▼
    │              Transcription, Translation, Segmentation
    │
    ├──────────────► API2 (/generate)
    │                     │
    │                     ▼
    │              Voice Cloning, Speech Generation
    │
    ├──────────────► API1 (/sync)
    │                     │
    │                     ▼
    │              WhisperX Alignment, Audio Synchronization
    │
    └──────────────► API4 (/render-video)
                          │
                          ▼
                     Wav2Lip, Video Rendering`}</code></pre>
          </article>

          {/* System Components Table */}
          <article className="docs-card docs-card-wide" data-reveal>
            <h3 className="docs-card-title">System Components</h3>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead>
                  <tr><th>Component</th><th>Responsibility</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Frontend</strong></td><td>User Interaction</td></tr>
                  <tr><td><strong>Main Backend</strong></td><td>Workflow Orchestration</td></tr>
                  <tr><td><strong>API1</strong></td><td>Transcription + Translation</td></tr>
                  <tr><td><strong>API1 /sync</strong></td><td>Audio Synchronization</td></tr>
                  <tr><td><strong>API2</strong></td><td>Voice Cloning & TTS</td></tr>
                  <tr><td><strong>API4</strong></td><td>Lip Synchronization</td></tr>
                  <tr><td><strong>FFmpeg</strong></td><td>Media Processing</td></tr>
                  <tr><td><strong>WhisperX</strong></td><td>Speech Recognition & Alignment</td></tr>
                  <tr><td><strong>NLLB</strong></td><td>Translation</td></tr>
                  <tr><td><strong>Wav2Lip</strong></td><td>Lip Synchronization</td></tr>
                </tbody>
              </table>
            </div>
          </article>

          {/* Workflow Modes */}
          <article className="docs-card docs-card-wide" data-reveal>
            <h3 className="docs-card-title">Workflow Modes</h3>
            <div className="workflow-grid">
              <div className="workflow-card">
                <div className="workflow-card-header">Mode 1 — Video Dubbing</div>
                <div className="workflow-card-body">
                  <div className="workflow-io">
                    <span className="io-tag io-tag-input">In: Video + Target Lang</span>
                    <span className="io-tag io-tag-output">Out: final.mp4</span>
                  </div>
                  <div className="workflow-pipeline">
                    <span className="pipeline-node">Video</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">Extract Audio</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API1 /process</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API2 /generate</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API1 /sync</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API4 /render-video</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node pipeline-node-success">Final Dubbed Video</span>
                  </div>
                </div>
              </div>

              <div className="workflow-card">
                <div className="workflow-card-header">Mode 2 — Audio Dubbing</div>
                <div className="workflow-card-body">
                  <div className="workflow-io">
                    <span className="io-tag io-tag-input">In: Audio + Target Lang</span>
                    <span className="io-tag io-tag-output">Out: synced.wav</span>
                  </div>
                  <div className="workflow-pipeline">
                    <span className="pipeline-node">Audio</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API1 /process</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API2 /generate</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API1 /sync</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node pipeline-node-success">synced.wav</span>
                  </div>
                </div>
              </div>

              <div className="workflow-card">
                <div className="workflow-card-header">Mode 3 — Voice Cloning</div>
                <div className="workflow-card-body">
                  <div className="workflow-io">
                    <span className="io-tag io-tag-input">In: Ref Audio + Text + Lang</span>
                    <span className="io-tag io-tag-output">Out: generated.wav</span>
                  </div>
                  <div className="workflow-pipeline">
                    <span className="pipeline-node">Reference Audio</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node">API2 /generate</span><span className="pipeline-arrow">↓</span>
                    <span className="pipeline-node pipeline-node-success">Generated Audio</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* API1 /process */}
          <article className="docs-card" data-reveal>
            <div className="endpoint-header">
              <h3 className="docs-card-title">API1 <span className="endpoint-path">/process</span></h3>
              <span className="endpoint-method">POST</span>
            </div>
            <p><strong>Purpose:</strong> Language Detection, Transcription, Translation, Segmentation.</p>
            <p>Input: WAV Audio, Target Language</p>
            <div className="flow-chain">Audio → WhisperX → Lang Detection → Transcription → NLLB Translation → Segments → JSON</div>
          </article>

          {/* API1 /sync */}
          <article className="docs-card" data-reveal>
            <div className="endpoint-header">
              <h3 className="docs-card-title">API1 <span className="endpoint-path">/sync</span></h3>
              <span className="endpoint-method">POST</span>
            </div>
            <p><strong>Purpose:</strong> Synchronizes generated audio with original timing.</p>
            <p>Input: Job ID, Generated Audio, Segments</p>
            <div className="flow-chain">Generated Audio → WhisperX Alignment → Timestamps → Match → FFmpeg Time Stretch & Silence → synced.wav</div>
          </article>

          {/* API2 /generate */}
          <article className="docs-card" data-reveal>
            <div className="endpoint-header">
              <h3 className="docs-card-title">API2 <span className="endpoint-path">/generate</span></h3>
              <span className="endpoint-method">POST</span>
            </div>
            <p><strong>Purpose:</strong> Voice cloning and speech generation.</p>
            <p>Input: Reference Audio, Text, Language</p>
            <p>Provider: k2-fsa-omnivoice (via Gradio API)</p>
            <div className="flow-chain fallback"><strong>Fallback Chain:</strong> HF_TOKEN → HF_TOKEN_2 → HF_TOKEN_3 → Private API2</div>
          </article>

          {/* API4 /render-video */}
          <article className="docs-card" data-reveal>
            <div className="endpoint-header">
              <h3 className="docs-card-title">API4 <span className="endpoint-path">/render-video</span></h3>
              <span className="endpoint-method">POST</span>
            </div>
            <p><strong>Purpose:</strong> Lip synchronization and final video generation.</p>
            <p>Input: Original Video, synced.wav</p>
            <div className="flow-chain">Video → Extract Frames → Wav2Lip → Lip Synced Frames → Recon Video → Merge Audio → final.mp4</div>
          </article>

          {/* Main Orchestrator */}
          <article className="docs-card" data-reveal>
            <h3 className="docs-card-title">Main Orchestrator Backend</h3>
            <p>Central controller of the platform. The frontend never communicates directly with APIs; all requests go through the orchestrator.</p>
            <ul className="docs-list">
              <li><strong>Validation:</strong> Formats, MIME Types, File Size.</li>
              <li><strong>Extraction:</strong> Video → FFmpeg → WAV.</li>
              <li><strong>Coordination:</strong> API1 → API2 → API1 /sync → API4.</li>
              <li><strong>Failover:</strong> Handles public provider failures & token rotation.</li>
              <li><strong>Storage:</strong> Manages <code className="inline-code">/temporary workspace</code>.</li>
            </ul>
          </article>

          {/* Health & Security */}
          <article className="docs-card" data-reveal>
            <h3 className="docs-card-title">Health Monitoring & Security</h3>
            <div className="health-info">
              <strong>Monitoring:</strong> Every service exposes <code className="inline-code">GET /health</code>. Backend aggregates checks. Monitored by UptimeRobot & cron-job.org.
            </div>
            <div className="security-info">
              <strong>Security Principles:</strong>
              <ul className="docs-list">
                <li>Never expose HF tokens or internal endpoints.</li>
                <li>Never expose provider credentials.</li>
                <li>Never commit <code className="inline-code">.env</code>.</li>
                <li>Temp Lifecycle: Receive → Process → Result → Delete. No permanent storage.</li>
              </ul>
            </div>
          </article>

          {/* Deployment & Future */}
          <article className="docs-card docs-card-wide" data-reveal>
            <div className="docs-card-split">
              <div>
                <h3 className="docs-card-title">Deployment Architecture</h3>
                <table className="docs-table compact">
                  <thead>
                    <tr><th>Service</th><th>Platform</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Frontend</td><td>Static Hosting</td></tr>
                    <tr><td>Main Backend</td><td>Hugging Face Space</td></tr>
                    <tr><td>API1</td><td>Hugging Face Space</td></tr>
                    <tr><td>API2 Private</td><td>Hugging Face Space</td></tr>
                    <tr><td>API4</td><td>Hugging Face Space</td></tr>
                    <tr><td>Public API2</td><td>External HF Space</td></tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="docs-card-title">Future Improvements</h3>
                <ul className="docs-list custom-bullet">
                  <li>Better TTS & Lip Sync Models</li>
                  <li>Improved Hindi Voice Cloning</li>
                  <li>MuseTalk Integration</li>
                  <li>Queue System & Batch Processing</li>
                  <li>User Accounts & Usage Analytics</li>
                  <li>GPU Optimization & Distributed Workers</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
